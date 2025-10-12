import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bet } from "../types";
import { formatDate, formatCurrency, getStatusColor } from "../utils";

interface BetsTableProps {
  bets: Bet[];
  onCreateBet: () => void;
  onEditBet: (bet: Bet) => void;
  onStatusChange: (bet: Bet) => void;
  onDeleteBet: (betId: number) => void;
}

export function BetsTable({
  bets,
  onCreateBet,
  onEditBet,
  onStatusChange,
  onDeleteBet,
}: BetsTableProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">Bets</h2>
        <Button onClick={onCreateBet}>Create Bet</Button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {bets.map((bet) => (
              <tr key={bet.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {bet.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {bet.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getStatusColor(bet.status)}>
                    {bet.status.replace("-", " ")}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(bet.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(bet.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditBet(bet)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onStatusChange(bet)}
                    >
                      Status
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteBet(bet.id)}
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
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No bets found
        </div>
      )}
    </>
  );
}
