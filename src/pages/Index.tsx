import { useState } from "react";
import { Pet, PetFormData } from "@/lib/api";
import { usePets, useSearchPets, useSavePet, useUpdatePet, useDeletePet } from "@/hooks/use-pets";
import { useAuth } from "@/contexts/AuthContext";
import { PetCard } from "@/components/PetCard";
import { SearchBar } from "@/components/SearchBar";
import { PetDialog } from "@/components/PetDialog";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { PawPrint, Plus, Loader2, LogIn, LogOut, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Index() {
  const { data: pets, isLoading, refetch } = usePets();
  const searchMutation = useSearchPets();
  const { user, isAuthenticated, logout } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [deletingPet, setDeletingPet] = useState<Pet | null>(null);

  const saveMutation = useSavePet(() => setDialogOpen(false));
  const updateMutation = useUpdatePet(() => {
    setDialogOpen(false);
    setEditingPet(null);
  });
  const deleteMutation = useDeletePet();

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setDialogOpen(true);
  };

  const handleNewPet = () => {
    if (!isAuthenticated) {
      toast.error("Faça login para cadastrar um pet.");
      return;
    }
    setEditingPet(null);
    setDialogOpen(true);
  };

  const handleSubmit = (data: PetFormData) => {
    if (editingPet) {
      updateMutation.mutate({ id: editingPet.id, data });
    } else {
      saveMutation.mutate(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingPet) {
      deleteMutation.mutate(deletingPet.id, {
        onSuccess: () => setDeletingPet(null),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PawPrint className="h-5 w-5" />
            </div>
            <h1 className="font-display text-xl font-bold tracking-tight">
              AdotaPet
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Olá, <strong className="text-foreground">{user?.name}</strong>
                </span>
                <Button onClick={handleNewPet}>
                  <Plus className="h-4 w-4 mr-1.5" /> Novo Pet
                </Button>
                <Button variant="outline" size="icon" onClick={logout} title="Sair">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-1.5" /> Entrar
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register">
                    <UserPlus className="h-4 w-4 mr-1.5" /> Cadastrar
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-6">
        <div className="text-center space-y-2 pb-2">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Sistema de Adoção de Pets 🐾
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Cadastre ou busque pets para encontrar um lar para cada um.
          </p>
        </div>

        <SearchBar
          onSearch={(filter) => searchMutation.mutate(filter)}
          onClear={() => refetch()}
          isPending={searchMutation.isPending}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !pets || pets.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <PawPrint className="h-12 w-12 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">Nenhum pet cadastrado ainda.</p>
            {isAuthenticated && (
              <Button variant="outline" onClick={handleNewPet}>
                <Plus className="h-4 w-4 mr-1.5" /> Cadastrar primeiro pet
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={handleEdit}
                onDelete={setDeletingPet}
                currentUserName={user?.name}
              />
            ))}
          </div>
        )}
      </main>

      <PetDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setEditingPet(null);
        }}
        pet={editingPet}
        onSubmit={handleSubmit}
        isPending={saveMutation.isPending || updateMutation.isPending}
      />

      <DeleteConfirmDialog
        open={!!deletingPet}
        onOpenChange={(open) => !open && setDeletingPet(null)}
        pet={deletingPet}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
