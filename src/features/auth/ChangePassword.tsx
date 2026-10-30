import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { changePassword } from "../../apis/profile.api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const input =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-[#00298d]";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (next.length < 8) return toast.error("New password must be at least 8 characters");
    if (next !== confirm) return toast.error("Passwords do not match");

    setSubmitting(true);
    try {
      await changePassword(current, next);
      toast.success("Password changed");
      navigate("/profile");
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl px-8 py-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-md"
      >
        <h1 className="text-2xl font-bold">Change password</h1>

        <input
          type="password"
          placeholder="Current password"
          className={input}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New password"
          className={input}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new password"
          className={input}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[#00298d] py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Change password"}
        </button>
      </form>
    </div>
  );
}