"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "../../../convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  clerkId: string;
  email: string;
  name: string;
};

export default function SetRoleModal({ open, onClose, clerkId, email, name }: Props) {
  const [password, setPassword] = useState("");
  const assignRole = useMutation(api.users.createUser);
  const router = useRouter();

  const handleSubmit = async () => {
    if (password !== process.env.NEXT_PUBLIC_DOOM_PASSWORD) {
      toast.error("Incorrect password. Access denied.");
      return;
    }

    try {
      await assignRole({
        clerkId,
        email,
        name,
        role: "interviewer",
      });
      toast.success("Welcome Doom!");
      onClose();
      router.push("/dashboard");
    } catch (err) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Doom’s Secret Password 🧠</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <Button onClick={handleSubmit} className="mt-4 w-full">
          Confirm
        </Button>
      </DialogContent>
    </Dialog>
  );
}