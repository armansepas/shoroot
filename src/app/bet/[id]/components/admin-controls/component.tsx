"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Play, Pause, CheckCircle, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useBets } from "@/hooks/use-bets";

interface AdminControlsProps {
  betId: number;
}

export function AdminControls({ betId }: AdminControlsProps) {
  const { user } = useAuth();
  const { getSingleBet } = useBets();
  const [bet, setBet] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    amount: "",
  });
  const [newStatus, setNewStatus] = useState("");
  const [winningOption, setWinningOption] = useState("");

  // Only show admin controls if user is admin
  if (!user || user.role !== "admin") {
    return null;
  }

  const fetchBet = async () => {
    try {
      const betData = await getSingleBet(betId);
      setBet(betData);
      setEditForm({
        title: betData.title,
        description: betData.description,
        amount: betData.amount.toString(),
      });
    } catch (error) {
      console.error("Error fetching bet for admin controls:", error);
    }
  };

  const handleEdit = async () => {
    if (
      !editForm.title.trim() ||
      !editForm.description.trim() ||
      !editForm.amount
    ) {
      alert("لطفا تمام فیلدها را پر کنید");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bets/${betId}/edit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title.trim(),
          description: editForm.description.trim(),
          amount: parseInt(editForm.amount),
        }),
      });

      if (response.ok) {
        setEditDialogOpen(false);
        fetchBet(); // Refresh bet data
        alert("بسته‌بندی با موفقیت ویرایش شد");
      } else {
        const error = await response.json();
        alert(error.error || "خطا در ویرایش بسته‌بندی");
      }
    } catch (error) {
      console.error("Error editing bet:", error);
      alert("خطا در ویرایش بسته‌بندی");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!newStatus) {
      alert("لطفا وضعیت جدید را انتخاب کنید");
      return;
    }

    // If resolving, winning option is required
    if (newStatus === "resolved" && !winningOption) {
      alert("برای حل بسته‌بندی، گزینه برنده را انتخاب کنید");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bets/${betId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          winningOption: newStatus === "resolved" ? winningOption : null,
        }),
      });

      if (response.ok) {
        setStatusDialogOpen(false);
        fetchBet(); // Refresh bet data
        alert("وضعیت بسته‌بندی با موفقیت تغییر کرد");
      } else {
        const error = await response.json();
        alert(error.error || "خطا در تغییر وضعیت");
      }
    } catch (error) {
      console.error("Error changing status:", error);
      alert("خطا در تغییر وضعیت");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "آیا مطمئن هستید که می‌خواهید این بسته‌بندی را حذف کنید؟ این عمل قابل بازگشت نیست."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bets/${betId}/delete`, {
        method: "POST",
      });

      if (response.ok) {
        alert("بسته‌بندی با موفقیت حذف شد");
        window.location.href = "/admin"; // Redirect to admin dashboard
      } else {
        const error = await response.json();
        alert(error.error || "خطا در حذف بسته‌بندی");
      }
    } catch (error) {
      console.error("Error deleting bet:", error);
      alert("خطا در حذف بسته‌بندی");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveParticipant = async (participationId: number) => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید این شرکت‌کننده را حذف کنید؟")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bets/${betId}/remove-participation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participationId }),
      });

      if (response.ok) {
        fetchBet(); // Refresh bet data
        alert("شرکت‌کننده با موفقیت حذف شد");
      } else {
        const error = await response.json();
        alert(error.error || "خطا در حذف شرکت‌کننده");
      }
    } catch (error) {
      console.error("Error removing participant:", error);
      alert("خطا در حذف شرکت‌کننده");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bet data when component mounts
  useState(() => {
    fetchBet();
  });

  if (!bet) {
    return <div className="text-center py-4">در حال بارگذاری...</div>;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          کنترل‌های ادمین
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Edit Bet */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              ویرایش بسته‌بندی
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ویرایش بسته‌بندی</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">عنوان</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder="عنوان بسته‌بندی"
                />
              </div>
              <div>
                <Label htmlFor="description">توضیحات</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="توضیحات بسته‌بندی"
                />
              </div>
              <div>
                <Label htmlFor="amount">مبلغ (تومان)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amount: e.target.value })
                  }
                  placeholder="مبلغ بسته‌بندی"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleEdit} disabled={loading}>
                  {loading ? "در حال ذخیره..." : "ذخیره"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditDialogOpen(false)}
                >
                  لغو
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Change Status */}
        <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Play className="h-4 w-4 mr-2" />
              تغییر وضعیت
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تغییر وضعیت بسته‌بندی</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>وضعیت فعلی: {bet.status}</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب وضعیت جدید" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">فعال</SelectItem>
                    <SelectItem value="in-progress">در حال انجام</SelectItem>
                    <SelectItem value="resolved">حل شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newStatus === "resolved" && (
                <div>
                  <Label>گزینه برنده</Label>
                  <Select
                    value={winningOption}
                    onValueChange={setWinningOption}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب گزینه برنده" />
                    </SelectTrigger>
                    <SelectContent>
                      {bet.options?.map((option: any) => (
                        <SelectItem key={option.id} value={option.optionText}>
                          {option.optionText}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={handleStatusChange} disabled={loading}>
                  {loading ? "در حال تغییر..." : "تغییر وضعیت"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setStatusDialogOpen(false)}
                >
                  لغو
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Bet */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              حذف بسته‌بندی
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>حذف بسته‌بندی</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              آیا مطمئن هستید که می‌خواهید این بسته‌بندی را حذف کنید؟ این عمل
              قابل بازگشت نیست.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "در حال حذف..." : "حذف"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                لغو
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Remove Participants */}
        {bet.participants?.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">مدیریت شرکت‌کنندگان</h4>
            {bet.participants.map((participant: any) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-2 border rounded"
              >
                <span>
                  کاربر {participant.userId} - {participant.selectedOptionText}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveParticipant(participant.id)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
