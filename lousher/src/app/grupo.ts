export interface Grupo {
  id: number;
  descricao: string;
  pais: string;
  regiao: string;
  mililitros: number;
  vol_alcoolico: number;
  tipo?: string;
  cor?: string;
  docura?: string;
  classe?: string;
  sabor?: string;
}