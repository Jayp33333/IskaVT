import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getMessages } = vi.hoisted(() => ({ getMessages: vi.fn() }));

vi.mock("../../../services/api", () => ({
  messageAPI: {
    getMessages,
    getUnreadCount: vi.fn(),
    updateMessage: vi.fn(),
    deleteMessage: vi.fn(),
  },
}));

import { useAutoRefresh } from "./useAutoRefresh";
import { useMessages } from "./useMessages";

function setHidden(hidden: boolean) {
  Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
  document.dispatchEvent(new Event("visibilitychange"));
}

const listResponse = (ids: string[]) => ({
  data: ids.map((id) => ({ _id: id })),
  unreadCount: 0,
  pagination: { page: 1, pages: 1 },
});

beforeEach(() => {
  vi.useFakeTimers();
  getMessages.mockReset();
});

afterEach(() => {
  setHidden(false);
  vi.useRealTimers();
});

describe("useAutoRefresh", () => {
  it("does not restart the interval when onTick changes identity", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(
      ({ onTick }) => useAutoRefresh({ intervalKey: "15s", onTick }),
      { initialProps: { onTick: first } }
    );

    act(() => vi.advanceTimersByTime(10_000));
    rerender({ onTick: second });
    act(() => vi.advanceTimersByTime(5_000));

    // Fired at 15s on the original schedule, using the latest callback.
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("skips ticks while hidden and refreshes once when visible again", () => {
    const onTick = vi.fn();
    renderHook(() => useAutoRefresh({ intervalKey: "15s", onTick }));

    setHidden(true);
    act(() => vi.advanceTimersByTime(45_000));
    expect(onTick).not.toHaveBeenCalled();

    act(() => setHidden(false));
    expect(onTick).toHaveBeenCalledTimes(1);
  });

  it("does nothing when refresh is off", () => {
    const onTick = vi.fn();
    renderHook(() => useAutoRefresh({ intervalKey: "off", onTick }));
    act(() => vi.advanceTimersByTime(10 * 60_000));
    expect(onTick).not.toHaveBeenCalled();
  });
});

describe("useMessages", () => {
  it("does not fetch the list while disabled, and loads once when enabled", async () => {
    getMessages.mockResolvedValue(listResponse(["a"]));
    const { rerender, result } = renderHook(
      ({ enabled }) => useMessages({ enabled }),
      { initialProps: { enabled: false } }
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });
    expect(getMessages).not.toHaveBeenCalled();

    rerender({ enabled: true });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_000);
    });
    expect(getMessages).toHaveBeenCalledTimes(1);
    expect(result.current.messages.map((m) => m._id)).toEqual(["a"]);
  });

  it("drops a stale response that resolves after a newer one", async () => {
    let resolveSlow!: (v: unknown) => void;
    getMessages
      .mockImplementationOnce(() => new Promise((r) => (resolveSlow = r)))
      .mockResolvedValueOnce(listResponse(["new"]));

    const { result } = renderHook(() => useMessages({ enabled: false }));

    let slow!: Promise<void>;
    await act(async () => {
      slow = result.current.loadMessages(1, { search: "o" });
      await result.current.loadMessages(1, { search: "ol" });
    });
    await act(async () => {
      resolveSlow(listResponse(["old"]));
      await slow;
    });

    expect(result.current.messages.map((m) => m._id)).toEqual(["new"]);
    expect(result.current.messagesLoading).toBe(false);
  });

  it("returns a stable object when nothing changed", () => {
    const { result, rerender } = renderHook(() => useMessages({ enabled: false }));
    const before = result.current;
    rerender();
    expect(result.current).toBe(before);
  });
});
