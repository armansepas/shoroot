"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  formatDate,
  formatCurrency,
  getStatusColor,
  getRoleColor,
} from "./utils";
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
          setAdminStats(statsData.adminStats);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Manage users and bets</p>
      </div>

      {/* Admin Stats */}
      {adminStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {adminStats.totalUsers}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Bets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {adminStats.activeBets}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resolved Bets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {adminStats.resolvedBets}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Closed Bets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {adminStats.closedBets}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Money Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {formatCurrency(adminStats.totalMoneyRaised)}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="bets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bets">Bets Management</TabsTrigger>
          <TabsTrigger value="users">Users Management</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Users</h2>
            <Button onClick={handleCreateUser}>Create User</Button>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-center py-8 text-gray-500">No users found</div>
          )}
        </TabsContent>

        <TabsContent value="bets" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Bets</h2>
            <Button onClick={handleCreateBet}>Create Bet</Button>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bets.map((bet) => (
                  <tr key={bet.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {bet.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {bet.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(bet.status)}>
                        {bet.status.replace("-", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(bet.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(bet.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBet(bet)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(bet)}
                        >
                          Status
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteBet(bet.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {bets.length === 0 && (
            <div className="text-center py-8 text-gray-500">No bets found</div>
          )}
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
