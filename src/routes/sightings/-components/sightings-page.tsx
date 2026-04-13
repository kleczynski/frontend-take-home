import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "../index";
import { useSightings, useDeleteSighting } from "@/hooks/use-sightings";
import { SightingsFilters } from "./sightings-filters";
import { getSightingsColumns } from "./sightings-columns";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { LogSightingDialog } from "./log-sighting-dialog";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import type { SightingsSearch } from "../index";

export function SightingsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [logOpen, setLogOpen] = useState(false);

  const { data, isLoading, isFetching } = useSightings(search);
  const deleteMutation = useDeleteSighting();

  const hasActiveFilters =
    search.pokemon_name ||
    search.region ||
    search.weather ||
    search.time_of_day ||
    search.date_from ||
    search.date_to;

  function setFilters(updates: Partial<SightingsSearch>) {
    navigate({
      search: (prev) => {
        const hasFilterChange = Object.keys(updates).some((k) => k !== "offset" && k !== "limit");
        return {
          ...prev,
          ...updates,
          offset: hasFilterChange ? 0 : (updates.offset ?? prev.offset),
        };
      },
    });
  }

  function handleDelete(id: string, pokemonName: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Sighting deleted", {
          description: `${pokemonName} has been removed`,
        });
      },
      onError: (err) => {
        toast.error("Failed to delete sighting", {
          description: err.message,
        });
      },
    });
  }

  const columns = getSightingsColumns(handleDelete);

  const emptyState = (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Eye className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium">No sightings found</h3>
      <p className="text-sm text-muted-foreground mt-1">
        {hasActiveFilters
          ? "Try adjusting your filters to find what you're looking for."
          : "Log your first sighting to get started."}
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Sightings" description="Track and manage field observations">
        <Button onClick={() => setLogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Log Sighting
        </Button>
      </PageHeader>

      <SightingsFilters filters={search} onFilterChange={setFilters} />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyState={emptyState}
      />

      <DataTablePagination
        total={data?.total ?? 0}
        limit={search.limit}
        offset={search.offset}
        onPageChange={(offset) => setFilters({ offset })}
        onPageSizeChange={(limit) =>
          navigate({
            search: (prev) => ({ ...prev, limit, offset: 0 }),
          })
        }
      />

      <LogSightingDialog open={logOpen} onOpenChange={setLogOpen} />
    </div>
  );
}
