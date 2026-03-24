import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { petApi, type Pet, type PetFormData } from "@/lib/api";
import { toast } from "sonner";

export function usePets() {
  return useQuery({
    queryKey: ["pets"],
    queryFn: async () => {
      const res = await petApi.findAll();
      return [...res.data].reverse();
    },
  });
}

export function useSearchPets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (filter: Partial<PetFormData>) => petApi.search(filter),
    onSuccess: (res) => {
      queryClient.setQueryData(["pets"], res.data);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useSavePet(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: PetFormData) => petApi.save(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Pet cadastrado com sucesso!");
      onSuccess?.();
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdatePet(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PetFormData }) =>
      petApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Pet atualizado com sucesso!");
      onSuccess?.();
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => petApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      toast.success("Pet removido com sucesso!");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
