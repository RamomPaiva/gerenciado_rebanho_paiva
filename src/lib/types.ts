export interface Animal {
  id: string;
  brinco: string;
  fase: 'cria' | 'recria' | 'ordenha';
  sexo: 'macho' | 'femea';
  raca: string;
  pesoAtual: number;
  gmd: number;
  dataNascimento?: string;
  dataCompra?: string;
  precoArroba?: number;
  custoAcumulado: number;
  observacoes?: string;
  mangaId?: string;
}

export interface Produto {
  id: string;
  nome: string;
  categoria: 'sal' | 'racao' | 'medicamento' | 'outros';
  quantidade: number;
  unidade: string;
  preco: number;
  dataCompra: string;
  dataVencimento?: string;
  fornecedor?: string;
  observacoes?: string;
}

export interface Medicamento {
  id: string;
  nome: string;
  tipo: 'vacina' | 'vermifugo' | 'antibiotico' | 'vitamina' | 'outros';
  quantidade: number;
  unidade: string;
  preco: number;
  dataCompra: string;
  dataVencimento: string;
  fornecedor?: string;
  observacoes?: string;
}

export interface ManejoSanitario {
  id: string;
  animalId: string;
  medicamentoId: string;
  tipo: 'vacinacao' | 'vermifugacao' | 'tratamento' | 'preventivo';
  dosagem: number;
  unidadeDosagem: string;
  dataAplicacao: string;
  proximaAplicacao?: string;
  custoAplicacao: number;
  observacoes?: string;
}

export interface Manga {
  id: string;
  nome: string;
  capacidade: number;
  status: 'livre' | 'ocupada' | 'manutencao';
  animaisIds: string[];
  observacoes?: string;
}

export interface CustoArrendamento {
  id: string;
  descricao: string;
  valor: number;
  dataInicio: string;
  dataFim?: string;
  observacoes?: string;
}

export interface CustoVaqueiro {
  id: string;
  nome: string;
  salario: number;
  mes: string;
  observacoes?: string;
}

export interface CustoManutencao {
  id: string;
  tipo: 'cerca' | 'arame' | 'estaca' | 'veneno' | 'rocar' | 'diaria_ajudante' | 'outros';
  descricao: string;
  valor: number;
  data: string;
  observacoes?: string;
}

export interface RecomendacaoIA {
  id: string;
  animalId: string;
  tipo: 'nutricao' | 'saude' | 'manejo' | 'reproducao';
  titulo: string;
  descricao: string;
  prioridade: 'baixa' | 'media' | 'alta';
  dataGeracao: string;
  status: 'pendente' | 'aplicada' | 'ignorada';
}

export interface DashboardStats {
  totalAnimais: number;
  animaisPorFase: {
    cria: number;
    recria: number;
    ordenha: number;
  };
  gmdMedio: number;
  custoMedioPorAnimal: number;
  produtosEmFalta: number;
  mangasOcupadas: number;
  medicamentosVencendo: number;
  manejosPendentes: number;
}

export interface MovimentacaoEstoque {
  id: string;
  produtoId: string;
  tipo: 'entrada' | 'saida';
  quantidade: number;
  data: string;
  animalId?: string;
  observacoes?: string;
}