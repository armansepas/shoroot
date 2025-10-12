"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import {
  User,
  Bet,
  CreateUserData,
  UpdateUserData,
  CreateBetData,
  UpdateBetData,
  AdminStats,
} from "./types";
import { Header } from "./header";
import { StatsCards } from "./stats-cards";
import { UsersTable } from "./users-table";
import { BetsTable } from "./bets-table";
import { UserModal } from "./user-modal";
import { BetModal } from "./bet-modal";
import { StatusModal } from "./status-modal";

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [bets, setBets] = useState<Bet[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState<"create" | "edit">(
    "create"
  );
  const [betModalMode, setBetModalMode] = useState<"create" | "edit">("create");
  const { user } = useAuth();

  const handleCreateUser = () => {
    setSelectedUser(null);
    setUserModalMode("create");
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserModalMode("edit");
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This will also delete all their participations."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await fetch(`/api/users/${userId}/delete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete user");
      }

      setUsers(users.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Delete user error:", error);
      alert("Failed to delete user");
    }
  };

  const handleUserSubmit = async (data: CreateUserData | UpdateUserData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const isCreate = userModalMode === "create";
      const endpoint = isCreate
        ? "/api/users/create"
        : `/api/users/${selectedUser?.id}/edit`;
      const method = "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to ${isCreate ? "create" : "update"} user`
        );
      }

      const result = await response.json();

      if (isCreate) {
        setUsers([...users, result.user]);
      } else {
        setUsers(
          users.map((u) => (u.id === selectedUser?.id ? result.user : u))
        );
      }
    } catch (error) {
      console.error("User submit error:", error);
      throw error;
    }
  };

  const handleCreateBet = () => {
    setSelectedBet(null);
    setBetModalMode("create");
    setIsBetModalOpen(true);
  };

  const handleEditBet = (bet: Bet) => {
    setSelectedBet(bet);
    setBetModalMode("edit");
    setIsBetModalOpen(true);
  };

  const handleStatusChange = (bet: Bet) => {
    setSelectedBet(bet);
    setIsStatusModalOpen(true);
  };

  const handleDeleteBet = async (betId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this bet? This will also delete all options and participations."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await fetch(`/api/bets/${betId}/delete`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete bet");
      }

      setBets(bets.filter((b) => b.id !== betId));
    } catch (error) {
      console.error("Delete bet error:", error);
      alert("Failed to delete bet");
    }
  };

  const handleBetSubmit = async (data: CreateBetData | UpdateBetData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const isCreate = betModalMode === "create";
      const endpoint = isCreate
        ? "/api/bets/create"
        : `/api/bets/${selectedBet?.id}/edit`;
      const method = "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `Failed to ${isCreate ? "create" : "update"} bet`
        );
      }

      const result = await response.json();

      if (isCreate) {
        setBets([...bets, result.bet]);
      } else {
        setBets(bets.map((b) => (b.id === selectedBet?.id ? result.bet : b)));
      }
    } catch (error) {
      console.error("Bet submit error:", error);
      throw error;
    }
  };

  const handleStatusSubmit = async (
    betId: number,
    status: string,
    winningOption?: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token");

      const response = await fetch(`/api/bets/${betId}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, winningOption }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update bet status");
      }

      const result = await response.json();
      setBets(bets.map((b) => (b.id === betId ? result.bet : b)));
    } catch (error) {
      console.error("Status change error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== "admin") return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          return;
        }

        const [usersResponse, betsResponse, statsResponse] = await Promise.all([
          fetch("/api/users/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/bets/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!usersResponse.ok || !betsResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [usersData, betsData] = await Promise.all([
          usersResponse.json(),
          betsResponse.json(),
        ]);

        setUsers(usersData.users);
        setBets(betsData.bets);

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          console.log("Admin stats data:", statsData.adminStats); // Debug log
          setAdminStats(statsData.adminStats);
        } else {
          console.error("Stats response failed:", statsResponse.status);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />

      {/* Admin Stats */}
      {adminStats && <StatsCards adminStats={adminStats} />}

      <Tabs defaultValue="bets" className="w-full">
        <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
          <TabsTrigger value="bets" className="dark:text-white">
            Bets Management
          </TabsTrigger>
          <TabsTrigger value="users" className="dark:text-white">
            Users Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UsersTable
            users={users}
            onCreateUser={handleCreateUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        </TabsContent>

        <TabsContent value="bets" className="mt-6">
          <BetsTable
            bets={bets}
            onCreateBet={handleCreateBet}
            onEditBet={handleEditBet}
            onStatusChange={handleStatusChange}
            onDeleteBet={handleDeleteBet}
          />
        </TabsContent>
      </Tabs>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={selectedUser}
        onSubmit={handleUserSubmit}
        mode={userModalMode}
      />

      <BetModal
        isOpen={isBetModalOpen}
        onClose={() => setIsBetModalOpen(false)}
        bet={selectedBet}
        onSubmit={handleBetSubmit}
        mode={betModalMode}
      />

      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        bet={selectedBet}
        onSubmit={handleStatusSubmit}
      />
    </div>
  );
}
