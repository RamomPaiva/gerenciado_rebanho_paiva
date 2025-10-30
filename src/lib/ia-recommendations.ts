import { Animal, RecomendacaoIA } from './types';
import { gerarId } from './storage';

// Função para gerar recomendações IA baseadas no animal
export const gerarRecomendacaoIA = (animal: Animal): RecomendacaoIA[] => {
  const recomendacoes: RecomendacaoIA[] = [];
  const hoje = new Date().toISOString().split('T')[0];

  // Recomendações baseadas no GMD
  if (animal.gmd < 0.5) {
    recomendacoes.push({
      id: gerarId(),
      animalId: animal.id,
      tipo: 'nutricao',
      titulo: 'GMD Baixo Detectado',
      descricao: `Animal ${animal.brinco} apresenta GMD de ${animal.gmd.toFixed(2)} kg/dia, abaixo do ideal. Considere suplementação nutricional ou avaliação veterinária.`,
      prioridade: 'alta',
      dataGeracao: hoje,
      status: 'pendente'
    });
  }

  // Recomendações baseadas no peso
  if (animal.fase === 'cria' && animal.pesoAtual > 200) {
    recomendacoes.push({
      id: gerarId(),
      animalId: animal.id,
      tipo: 'manejo',
      titulo: 'Transição para Recria',
      descricao: `Animal ${animal.brinco} com ${animal.pesoAtual}kg pode ser transferido para fase de recria.`,
      prioridade: 'media',
      dataGeracao: hoje,
      status: 'pendente'
    });
  }

  // Recomendações baseadas na fase
  if (animal.fase === 'ordenha' && animal.sexo === 'femea') {
    recomendacoes.push({
      id: gerarId(),
      animalId: animal.id,
      tipo: 'reproducao',
      titulo: 'Monitoramento Reprodutivo',
      descricao: `Fêmea ${animal.brinco} em fase de ordenha. Monitore ciclo reprodutivo e considere inseminação artificial.`,
      prioridade: 'media',
      dataGeracao: hoje,
      status: 'pendente'
    });
  }

  return recomendacoes;
};

// Função para gerar recomendações sazonais
export const gerarRecomendacoesSazonais = (): string[] => {
  const mes = new Date().getMonth() + 1; // 1-12
  
  const recomendacoesPorMes: { [key: number]: string[] } = {
    1: [ // Janeiro
      'Período de chuvas: monitore parasitas e doenças de casco',
      'Aproveite pastagens verdes para ganho de peso',
      'Planeje vacinações contra clostridioses'
    ],
    2: [ // Fevereiro
      'Continue monitoramento de parasitas',
      'Avalie condição corporal dos animais',
      'Prepare estratégias para período seco'
    ],
    3: [ // Março
      'Início da transição para período seco',
      'Intensifique suplementação mineral',
      'Avalie qualidade das pastagens'
    ],
    4: [ // Abril
      'Período seco se aproxima: planeje suplementação',
      'Monitore disponibilidade de água',
      'Considere desmame de bezerros'
    ],
    5: [ // Maio
      'Intensifique suplementação proteica',
      'Monitore peso dos animais',
      'Planeje manejo de pastagens'
    ],
    6: [ // Junho
      'Pico do período seco: máxima suplementação',
      'Monitore condição corporal rigorosamente',
      'Avalie necessidade de suplementação energética'
    ],
    7: [ // Julho
      'Continue suplementação intensiva',
      'Monitore saúde respiratória',
      'Planeje estratégias reprodutivas'
    ],
    8: [ // Agosto
      'Final do período seco: mantenha suplementação',
      'Prepare para estação de monta',
      'Avalie condição corporal das matrizes'
    ],
    9: [ // Setembro
      'Início das chuvas: reduza suplementação gradualmente',
      'Monitore transição alimentar',
      'Inicie estação de monta'
    ],
    10: [ // Outubro
      'Pastagens em recuperação: monitore qualidade',
      'Continue estação de monta',
      'Planeje vacinações reprodutivas'
    ],
    11: [ // Novembro
      'Pastagens verdes: aproveite para ganho de peso',
      'Monitore prenhez das matrizes',
      'Planeje desmame'
    ],
    12: [ // Dezembro
      'Final do ano: avalie resultados',
      'Planeje estratégias para próximo ano',
      'Monitore nascimentos'
    ]
  };

  return recomendacoesPorMes[mes] || [
    'Monitore regularmente a condição dos animais',
    'Mantenha suplementação mineral adequada',
    'Acompanhe calendário sanitário'
  ];
};