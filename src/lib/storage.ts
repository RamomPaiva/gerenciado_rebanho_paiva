import { 
  Animal, 
  Produto, 
  Medicamento, 
  ManejoSanitario, 
  Manga, 
  CustoArrendamento, 
  CustoVaqueiro,
  CustoManutencao,
  RecomendacaoIA, 
  MovimentacaoEstoque 
} from './types';

// Função para gerar IDs únicos
export const gerarId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Storage para animais
export const animalStorage = {
  getAll: (): Animal[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('animais');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar animais:', error);
      return [];
    }
  },
  add: (animal: Animal) => {
    if (typeof window === 'undefined') return;
    try {
      const animais = animalStorage.getAll();
      animais.push(animal);
      localStorage.setItem('animais', JSON.stringify(animais));
    } catch (error) {
      console.error('Erro ao adicionar animal:', error);
    }
  },
  update: (id: string, updates: Partial<Animal>) => {
    if (typeof window === 'undefined') return;
    try {
      const animais = animalStorage.getAll();
      const index = animais.findIndex(a => a.id === id);
      if (index !== -1) {
        animais[index] = { ...animais[index], ...updates };
        localStorage.setItem('animais', JSON.stringify(animais));
      }
    } catch (error) {
      console.error('Erro ao atualizar animal:', error);
    }
  },
  delete: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const animais = animalStorage.getAll().filter(a => a.id !== id);
      localStorage.setItem('animais', JSON.stringify(animais));
    } catch (error) {
      console.error('Erro ao deletar animal:', error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('animais');
    } catch (error) {
      console.error('Erro ao limpar animais:', error);
    }
  }
};

// Storage para produtos
export const produtoStorage = {
  getAll: (): Produto[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('produtos');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      return [];
    }
  },
  add: (produto: Produto) => {
    if (typeof window === 'undefined') return;
    try {
      const produtos = produtoStorage.getAll();
      produtos.push(produto);
      localStorage.setItem('produtos', JSON.stringify(produtos));
    } catch (error) {
      console.error('Erro ao adicionar produto:', error);
    }
  },
  update: (id: string, updates: Partial<Produto>) => {
    if (typeof window === 'undefined') return;
    try {
      const produtos = produtoStorage.getAll();
      const index = produtos.findIndex(p => p.id === id);
      if (index !== -1) {
        produtos[index] = { ...produtos[index], ...updates };
        localStorage.setItem('produtos', JSON.stringify(produtos));
      }
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
    }
  },
  delete: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const produtos = produtoStorage.getAll().filter(p => p.id !== id);
      localStorage.setItem('produtos', JSON.stringify(produtos));
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('produtos');
    } catch (error) {
      console.error('Erro ao limpar produtos:', error);
    }
  }
};

// Storage para medicamentos
export const medicamentoStorage = {
  getAll: (): Medicamento[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('medicamentos');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar medicamentos:', error);
      return [];
    }
  },
  add: (medicamento: Medicamento) => {
    if (typeof window === 'undefined') return;
    try {
      const medicamentos = medicamentoStorage.getAll();
      medicamentos.push(medicamento);
      localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
    } catch (error) {
      console.error('Erro ao adicionar medicamento:', error);
    }
  },
  update: (id: string, updates: Partial<Medicamento>) => {
    if (typeof window === 'undefined') return;
    try {
      const medicamentos = medicamentoStorage.getAll();
      const index = medicamentos.findIndex(m => m.id === id);
      if (index !== -1) {
        medicamentos[index] = { ...medicamentos[index], ...updates };
        localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
      }
    } catch (error) {
      console.error('Erro ao atualizar medicamento:', error);
    }
  },
  delete: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const medicamentos = medicamentoStorage.getAll().filter(m => m.id !== id);
      localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
    } catch (error) {
      console.error('Erro ao deletar medicamento:', error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('medicamentos');
    } catch (error) {
      console.error('Erro ao limpar medicamentos:', error);
    }
  }
};

// Storage para manejo sanitário
export const manejoStorage = {
  getAll: (): ManejoSanitario[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('manejos');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar manejos:', error);
      return [];
    }
  },
  add: (manejo: ManejoSanitario) => {
    if (typeof window === 'undefined') return;
    try {
      const manejos = manejoStorage.getAll();
      manejos.push(manejo);
      localStorage.setItem('manejos', JSON.stringify(manejos));
    } catch (error) {
      console.error('Erro ao adicionar manejo:', error);
    }
  },
  update: (id: string, updates: Partial<ManejoSanitario>) => {
    if (typeof window === 'undefined') return;
    try {
      const manejos = manejoStorage.getAll();
      const index = manejos.findIndex(m => m.id === id);
      if (index !== -1) {
        manejos[index] = { ...manejos[index], ...updates };
        localStorage.setItem('manejos', JSON.stringify(manejos));
      }
    } catch (error) {
      console.error('Erro ao atualizar manejo:', error);
    }
  },
  delete: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const manejos = manejoStorage.getAll().filter(m => m.id !== id);
      localStorage.setItem('manejos', JSON.stringify(manejos));
    } catch (error) {
      console.error('Erro ao deletar manejo:', error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('manejos');
    } catch (error) {
      console.error('Erro ao limpar manejos:', error);
    }
  }
};

// Storage para mangas
export const mangaStorage = {
  getAll: (): Manga[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('mangas');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar mangas:', error);
      return [];
    }
  },
  add: (manga: Manga) => {
    if (typeof window === 'undefined') return;
    try {
      const mangas = mangaStorage.getAll();
      mangas.push(manga);
      localStorage.setItem('mangas', JSON.stringify(mangas));
    } catch (error) {
      console.error('Erro ao adicionar manga:', error);
    }
  },
  update: (id: string, updates: Partial<Manga>) => {
    if (typeof window === 'undefined') return;
    try {
      const mangas = mangaStorage.getAll();
      const index = mangas.findIndex(m => m.id === id);
      if (index !== -1) {
        mangas[index] = { ...mangas[index], ...updates };
        localStorage.setItem('mangas', JSON.stringify(mangas));
      }
    } catch (error) {
      console.error('Erro ao atualizar manga:', error);
    }
  },
  delete: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const mangas = mangaStorage.getAll().filter(m => m.id !== id);
      localStorage.setItem('mangas', JSON.stringify(mangas));
    } catch (error) {
      console.error('Erro ao deletar manga:', error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('mangas');
    } catch (error) {
      console.error('Erro ao limpar mangas:', error);
    }
  }
};

// Storage para custos de arrendamento
export const custoArrendamentoStorage = {
  getAll: (): CustoArrendamento[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('custosArrendamento');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar custos de arrendamento:', error);
      return [];
    }
  },
  add: (custo: CustoArrendamento) => {
    if (typeof window === 'undefined') return;
    try {
      const custos = custoArrendamentoStorage.getAll();
      custos.push(custo);
      localStorage.setItem('custosArrendamento', JSON.stringify(custos));
    } catch (error) {
      console.error('Erro ao adicionar custo de arrendamento:', error);
    }
  },
  update: (id: string, updates: Partial<CustoArrendamento>) => {
    if (typeof window === 'undefined') return;
    try {
      const custos = custoArrendamentoStorage.getAll();
      const index = custos.findIndex(c => c.id === id);
      if (index !== -1) {
        custos[index] = { ...custos[index], ...updates };
        localStorage.setItem('custosArrendamento', JSON.stringify(custos));
      }
    } catch (error) {
      console.error('Erro ao atualizar custo de arrendamento:', error);
    }
  },
  delete: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const custos = custoArrendamentoStorage.getAll().filter(c => c.id !== id);
      localStorage.setItem('custosArrendamento', JSON.stringify(custos));
    } catch (error) {
      console.error('Erro ao deletar custo de arrendamento:', error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('custosArrendamento');
    } catch (error) {
      console.error('Erro ao limpar custos de arrendamento:', error);
    }
  }
};

// Storage para custos de vaqueiro
export const custoVaqueiroStorage = {
  getAll: (): CustoVaqueiro[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('custosVaqueiro');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar custos de vaqueiro:', error);
      return [];
    }
  },
  add: (custo: CustoVaqueiro) => {
    if (typeof window === 'undefined') return;
    try {
      const custos = custoVaqueiroStorage.getAll();
      custos.push(custo);
      localStorage.setItem('custosVaqueiro', JSON.stringify(custos));
    } catch (error) {
      console.error('Erro ao adicionar custo de vaqueiro:', error);
    }
  },
  update: (id: string, updates: Partial<CustoVaqueiro>) => {
    if (typeof window === 'undefined') return;
    try {
      const custos = custoVaqueiroStorage.getAll();
      const index = custos.findIndex(c => c.id === id);
      if (index !== -1) {
        custos[index] = { ...custos[index], ...updates };
        localStorage.setItem('custosVaqueiro', JSON.stringify(custos));
      }
    } catch (error) {
      console.error('Erro ao atualizar custo de vaqueiro:', error);
    }
  },
  delete: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const custos = custoVaqueiroStorage.getAll().filter(c => c.id !== id);
      localStorage.setItem('custosVaqueiro', JSON.stringify(custos));
    } catch (error) {
      console.error('Erro ao deletar custo de vaqueiro:', error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('custosVaqueiro');
    } catch (error) {
      console.error('Erro ao limpar custos de vaqueiro:', error);
    }
  }
};

// Storage para custos de manutenção
export const custoManutencaoStorage = {
  getAll: (): CustoManutencao[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('custosManutencao');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar custos de manutenção:', error);
      return [];
    }
  },
  add: (custo: CustoManutencao) => {
    if (typeof window === 'undefined') return;
    try {
      const custos = custoManutencaoStorage.getAll();
      custos.push(custo);
      localStorage.setItem('custosManutencao', JSON.stringify(custos));
    } catch (error) {
      console.error('Erro ao adicionar custo de manutenção:', error);
    }
  },
  update: (id: string, updates: Partial<CustoManutencao>) => {
    if (typeof window === 'undefined') return;
    try {
      const custos = custoManutencaoStorage.getAll();
      const index = custos.findIndex(c => c.id === id);
      if (index !== -1) {
        custos[index] = { ...custos[index], ...updates };
        localStorage.setItem('custosManutencao', JSON.stringify(custos));
      }
    } catch (error) {
      console.error('Erro ao atualizar custo de manutenção:', error);
    }
  },
  delete: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const custos = custoManutencaoStorage.getAll().filter(c => c.id !== id);
      localStorage.setItem('custosManutencao', JSON.stringify(custos));
    } catch (error) {
      console.error('Erro ao deletar custo de manutenção:', error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('custosManutencao');
    } catch (error) {
      console.error('Erro ao limpar custos de manutenção:', error);
    }
  }
};

// Storage para recomendações IA
export const recomendacaoStorage = {
  getAll: (): RecomendacaoIA[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('recomendacoes');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar recomendações:', error);
      return [];
    }
  },
  add: (recomendacao: RecomendacaoIA) => {
    if (typeof window === 'undefined') return;
    try {
      const recomendacoes = recomendacaoStorage.getAll();
      recomendacoes.push(recomendacao);
      localStorage.setItem('recomendacoes', JSON.stringify(recomendacoes));
    } catch (error) {
      console.error('Erro ao adicionar recomendação:', error);
    }
  },
  update: (id: string, updates: Partial<RecomendacaoIA>) => {
    if (typeof window === 'undefined') return;
    try {
      const recomendacoes = recomendacaoStorage.getAll();
      const index = recomendacoes.findIndex(r => r.id === id);
      if (index !== -1) {
        recomendacoes[index] = { ...recomendacoes[index], ...updates };
        localStorage.setItem('recomendacoes', JSON.stringify(recomendacoes));
      }
    } catch (error) {
      console.error('Erro ao atualizar recomendação:', error);
    }
  },
  delete: (id: string) => {
    if (typeof window === 'undefined') return;
    try {
      const recomendacoes = recomendacaoStorage.getAll().filter(r => r.id !== id);
      localStorage.setItem('recomendacoes', JSON.stringify(recomendacoes));
    } catch (error) {
      console.error('Erro ao deletar recomendação:', error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('recomendacoes');
    } catch (error) {
      console.error('Erro ao limpar recomendações:', error);
    }
  }
};

// Storage para movimentações de estoque
export const movimentacaoStorage = {
  getAll: (): MovimentacaoEstoque[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem('movimentacoes');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar movimentações:', error);
      return [];
    }
  },
  add: (movimentacao: MovimentacaoEstoque) => {
    if (typeof window === 'undefined') return;
    try {
      const movimentacoes = movimentacaoStorage.getAll();
      movimentacoes.push(movimentacao);
      localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
    } catch (error) {
      console.error('Erro ao adicionar movimentação:', error);
    }
  },
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('movimentacoes');
    } catch (error) {
      console.error('Erro ao limpar movimentações:', error);
    }
  }
};

// Funções utilitárias
export const calcularGMD = (pesoInicial: number, pesoAtual: number, dias: number): number => {
  return (pesoAtual - pesoInicial) / dias;
};

export const calcularCustoMedioPorAnimal = (animais: Animal[]): number => {
  if (animais.length === 0) return 0;
  const custoTotal = animais.reduce((total, animal) => total + animal.custoAcumulado, 0);
  return custoTotal / animais.length;
};