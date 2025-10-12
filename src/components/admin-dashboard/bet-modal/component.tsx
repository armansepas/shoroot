"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bet, CreateBetData, UpdateBetData } from "../types";
import { validateBetOptions } from "../utils";

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet?: Bet | null;
  onSubmit: (data: CreateBetData | UpdateBetData) => Promise<void>;
  mode: "create" | "edit";
}

export function BetModal({
  isOpen,
  onClose,
  bet,
  onSubmit,
  mode,
}: BetModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    amount?: string;
    options?: string;
  }>({});

  useEffect(() => {
    if (mode === "edit" && bet) {
      setTitle(bet.title);
      setDescription(bet.description);
      setAmount(bet.amount.toString());
      setOptions(bet.options.map((opt) => opt.optionText));
    } else {
      setTitle("");
      setDescription("");
      setAmount("");
      setOptions(["", ""]);
    }
    setErrors({});
  }, [bet, mode, isOpen]);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      amount?: string;
      options?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    const amountValue = parseFloat(amount);
    if (!amount || isNaN(amountValue) || amountValue <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }

    const optionsValidation = validateBetOptions(options);
    if (!optionsValidation.isValid) {
      newErrors.options = optionsValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const data =
        mode === "create"
          ? {
              title: title.trim(),
              description: description.trim(),
              amount: parseFloat(amount),
              options: options.map((opt) => opt.trim()).filter((opt) => opt),
            }
          : {
              ...(title.trim() !== bet?.title && { title: title.trim() }),
              ...(description.trim() !== bet?.description && {
                description: description.trim(),
              }),
              ...(parseFloat(amount) !== bet?.amount && {
                amount: parseFloat(amount),
              }),
              ...(JSON.stringify(
                options.map((opt) => opt.trim()).filter((opt) => opt)
              ) !==
                JSON.stringify(bet?.options.map((opt) => opt.optionText)) && {
                options: options.map((opt) => opt.trim()).filter((opt) => opt),
              }),
            };

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error("Bet modal submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTitle("");
    setDescription("");
    setAmount("");
    setOptions(["", ""]);
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create Bet" : "Edit Bet"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new bet with options for users to participate in."
              : "Update bet information. All fields are optional."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <div className="col-span-3">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <div className="col-span-3">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount (Toman)
            </Label>
            <div className="col-span-3">
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={errors.amount ? "border-red-500" : ""}
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Options</Label>
            <div className="col-span-3 space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className={errors.options ? "border-red-500" : ""}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                className="w-full"
              >
                Add Option
              </Button>
              {errors.options && (
                <p className="text-sm text-red-500">{errors.options}</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create"
              : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
