export const validateBetEditForm = (form: {
  title: string;
  description: string;
  amount: string;
}) => {
  const errors: string[] = [];

  if (!form.title.trim()) {
    errors.push("عنوان الزامی است");
  }

  if (!form.description.trim()) {
    errors.push("توضیحات الزامی است");
  }

  if (
    !form.amount ||
    isNaN(parseInt(form.amount)) ||
    parseInt(form.amount) <= 0
  ) {
    errors.push("مبلغ باید عدد مثبت باشد");
  }

  return errors;
};

export const getStatusOptions = () => [
  { value: "active", label: "فعال" },
  { value: "in-progress", label: "در حال انجام" },
  { value: "resolved", label: "حل شده" },
];

export const canChangeToStatus = (
  currentStatus: string,
  newStatus: string
): boolean => {
  // Define valid status transitions
  const transitions: Record<string, string[]> = {
    active: ["in-progress", "resolved"],
    "in-progress": ["active", "resolved"],
    resolved: ["active"], // Can undo resolution
  };

  return transitions[currentStatus]?.includes(newStatus) ?? false;
};
