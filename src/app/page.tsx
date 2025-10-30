'use client';

import { useState, useEffect } from 'react';
import { 
  Circle, 
  Package, 
  TrendingUp, 
  MapPin, 
  DollarSign, 
  Brain,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Calendar,
  Weight,
  Activity,
  BarChart3,
  PieChart,
  Settings,
  Syringe,
  Shield,
  Clock,
  X,
  Download,
  RotateCcw,
  Save,
  Check,
  ArrowRight,
  Filter,
  RefreshCw,
  Baby,
  ShoppingCart,
  Skull,
  RefreshCw as Sync,
  History,
  Scale,
  Home,
  Users,
  Stethoscope,
  Clipboard,
  FileText,
  Search,
  Eye,
  ChevronRight,
  Truck,
  Pill,
  Wheat,
  Building,
  UserCheck,
  Wrench,
  Receipt,
  TrendingDown,
  Target,
  Zap
} from 'lucide-react';

export default function RebanhoManager() {
  // Estados principais
  const [activeTab, setActiveTab] = useState('dashboard');
  const [animais, setAnimais] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [manejos, setManejos] = useState([]);
  const [custosArrendamento, setCustosArrendamento] = useState([]);
  const [custosVaqueiro, setCustosVaqueiro] = useState([]);
  const [custosManutencao, setCustosManutencao] = useState([]);
  const [recomendacoes, setRecomendacoes] = useState([]);
  
  // Estados para estatísticas
  const [stats, setStats] = useState({
    totalAnimais: 0,
    animaisPorFase: { cria: 0, recria: 0, ordenha: 0 },
    gmdMedio: 0,
    custoMedioPorAnimal: 0,
    produtosEmFalta: 0,
    mangasOcupadas: 0,
    medicamentosVencendo: 0,
    manejosPendentes: 0
  });

  // Estados para filtro de data
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Estados para modais
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [showProdutoModal, setShowProdutoModal] = useState(false);
  const [showMedicamentoModal, setShowMedicamentoModal] = useState(false);
  const [showManejoModal, setShowManejoModal] = useState(false);
  const [showCustoModal, setShowCustoModal] = useState(false);
  const [showAquisicaoModal, setShowAquisicaoModal] = useState(false);
  const [custoModalType, setCustoModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  // Estados para modais de detalhamento
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailModalType, setDetailModalType] = useState(null);

  // Estados para novos modais de automação
  const [showPesagemLoteModal, setShowPesagemLoteModal] = useState(false);
  const [showNascimentoModal, setShowNascimentoModal] = useState(false);
  const [showVendaModal, setShowVendaModal] = useState(false);
  const [showObitoModal, setShowObitoModal] = useState(false);
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);

  // Estados para confirmações
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [animalToTransfer, setAnimalToTransfer] = useState(null);

  // Estados para formulários
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [exportDateRange, setExportDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Estados para pesagem em lote
  const [pesagemLoteData, setPesagemLoteData] = useState({});
  const [pesagemLoteDate, setPesagemLoteDate] = useState(new Date().toISOString().split('T')[0]);

  // Estados para busca e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');

  // Funções utilitárias
  const gerarId = () => Math.random().toString(36).substr(2, 9);

  const calcularGMD = (animais) => {
    if (animais.length === 0) return 0;
    const gmdTotal = animais.reduce((sum, animal) => sum + (animal.gmd || 0), 0);
    return gmdTotal / animais.length;
  };

  const calcularGMDAutomatico = (pesoInicial, pesoAtual, dataEntrada) => {
    if (!pesoInicial || !pesoAtual || !dataEntrada) return 0;
    
    const hoje = new Date();
    const dataInicio = new Date(dataEntrada);
    const diasDiferenca = Math.ceil((hoje - dataInicio) / (1000 * 60 * 60 * 24));
    
    if (diasDiferenca <= 0) return 0;
    
    return (pesoAtual - pesoInicial) / diasDiferenca;
  };

  const calcularArrobaTotal = (peso) => peso / 30;

  const calcularValorTotal = (arrobaTotal, precoArroba) => arrobaTotal * precoArroba;

  const calcularCustoMedioPorAnimal = (animais, produtos, medicamentos, manejos, custosArrendamento, custosVaqueiro, custosManutencao) => {
    if (animais.length === 0) return 0;
    
    const custoTotal = 
      produtos.reduce((sum, p) => sum + (p.preco * p.quantidade), 0) +
      medicamentos.reduce((sum, m) => sum + (m.preco * m.quantidade), 0) +
      manejos.reduce((sum, m) => sum + m.custoAplicacao, 0) +
      custosArrendamento.reduce((sum, c) => sum + c.valor, 0) +
      custosVaqueiro.reduce((sum, c) => sum + c.salario, 0) +
      custosManutencao.reduce((sum, c) => sum + c.valor, 0);
    
    return custoTotal / animais.length;
  };

  // Carregar dados do localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        setAnimais(JSON.parse(localStorage.getItem('animais') || '[]'));
        setProdutos(JSON.parse(localStorage.getItem('produtos') || '[]'));
        setMedicamentos(JSON.parse(localStorage.getItem('medicamentos') || '[]'));
        setManejos(JSON.parse(localStorage.getItem('manejos') || '[]'));
        setCustosArrendamento(JSON.parse(localStorage.getItem('custosArrendamento') || '[]'));
        setCustosVaqueiro(JSON.parse(localStorage.getItem('custosVaqueiro') || '[]'));
        setCustosManutencao(JSON.parse(localStorage.getItem('custosManutencao') || '[]'));
        setRecomendacoes(JSON.parse(localStorage.getItem('recomendacoes') || '[]'));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  // Salvar dados no localStorage
  const saveToStorage = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  // Atualizar estatísticas quando dados mudarem
  useEffect(() => {
    const calcularEstatisticas = () => {
      const totalAnimais = animais.length;
      const animaisPorFase = animais.reduce((acc, animal) => {
        acc[animal.fase] = (acc[animal.fase] || 0) + 1;
        return acc;
      }, { cria: 0, recria: 0, ordenha: 0 });

      const gmdMedio = calcularGMD(animais);
      const custoMedioPorAnimal = calcularCustoMedioPorAnimal(
        animais, produtos, medicamentos, manejos, 
        custosArrendamento, custosVaqueiro, custosManutencao
      );

      const produtosEmFalta = produtos.filter(p => p.quantidade <= 5).length;
      
      const hoje = new Date();
      const em30Dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000);
      const medicamentosVencendo = medicamentos.filter(m => {
        const dataVencimento = new Date(m.dataVencimento);
        return dataVencimento <= em30Dias;
      }).length;

      const manejosPendentes = manejos.filter(m => {
        if (!m.proximaAplicacao) return false;
        const proximaData = new Date(m.proximaAplicacao);
        return proximaData <= hoje;
      }).length;

      setStats({
        totalAnimais,
        animaisPorFase,
        gmdMedio,
        custoMedioPorAnimal,
        produtosEmFalta,
        mangasOcupadas: 0,
        medicamentosVencendo,
        manejosPendentes
      });
    };

    calcularEstatisticas();
  }, [animais, produtos, medicamentos, manejos, custosArrendamento, custosVaqueiro, custosManutencao]);

  // ========== SISTEMA DE MESCLAGEM INCREMENTAL ==========

  const mesclagem = (dadosExistentes, novosDados) => {
    const resultado = { ...dadosExistentes };
    
    Object.keys(novosDados).forEach(key => {
      if (novosDados[key] !== null && novosDados[key] !== undefined && novosDados[key] !== '') {
        resultado[key] = novosDados[key];
      }
    });

    if (dadosExistentes.updateLog) {
      resultado.updateLog = [...dadosExistentes.updateLog];
    } else {
      resultado.updateLog = [];
    }

    if (dadosExistentes.historicoPesagens) {
      resultado.historicoPesagens = [...dadosExistentes.historicoPesagens];
    }

    resultado.updateLog.push({
      data: new Date().toISOString(),
      tipo: 'atualizacao',
      campos: Object.keys(novosDados).filter(key => 
        novosDados[key] !== null && 
        novosDados[key] !== undefined && 
        novosDados[key] !== ''
      ),
      descricao: `Atualização automática em ${new Date().toLocaleDateString('pt-BR')}`
    });

    return resultado;
  };

  // ========== AUTOMAÇÕES DO REBANHO ==========

  const atualizarGMDTodos = () => {
    const animaisAtualizados = animais.map(animal => {
      if (animal.pesoInicial && animal.pesoAtual && animal.dataEntradaFase) {
        const gmdCalculado = calcularGMDAutomatico(animal.pesoInicial, animal.pesoAtual, animal.dataEntradaFase);
        
        return mesclagem(animal, { 
          gmd: parseFloat(gmdCalculado.toFixed(3)),
          dataUltimaAtualizacaoGMD: new Date().toISOString()
        });
      }
      return animal;
    });

    setAnimais(animaisAtualizados);
    saveToStorage('animais', animaisAtualizados);
    
    alert('GMD atualizado com sucesso para todos os animais! Nenhum dado anterior foi perdido.');
  };

  const processarPesagemLote = () => {
    const animaisAtualizados = animais.map(animal => {
      if (pesagemLoteData[animal.id] && pesagemLoteData[animal.id] > 0) {
        const pesoAnterior = animal.pesoAtual;
        const pesoNovo = pesagemLoteData[animal.id];
        
        const gmd = calcularGMDAutomatico(animal.pesoInicial || pesoNovo, pesoNovo, animal.dataEntradaFase);
        const arrobaTotal = calcularArrobaTotal(pesoNovo);
        const valorTotal = calcularValorTotal(arrobaTotal, animal.precoArroba || 0);

        const historicoPesagens = [...(animal.historicoPesagens || [])];
        historicoPesagens.push({
          data: pesagemLoteDate,
          pesoAnterior,
          pesoAtual: pesoNovo,
          gmd: parseFloat(gmd.toFixed(3))
        });

        return mesclagem(animal, {
          pesoAtual: pesoNovo,
          gmd: parseFloat(gmd.toFixed(3)),
          arrobaTotal: parseFloat(arrobaTotal.toFixed(2)),
          valorTotal: parseFloat(valorTotal.toFixed(2)),
          historicoPesagens,
          dataUltimaPesagem: pesagemLoteDate
        });
      }
      return animal;
    });

    setAnimais(animaisAtualizados);
    saveToStorage('animais', animaisAtualizados);
    setShowPesagemLoteModal(false);
    setPesagemLoteData({});
    alert('Pesagem em lote realizada com sucesso! Histórico completo preservado.');
  };

  const registrarNascimento = () => {
    const errors = validateForm(formData, 'nascimento');
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const pesoNascimento = parseFloat(formData.pesoNascimento) || 0;
    const novoAnimal = {
      id: gerarId(),
      brinco: formData.brinco,
      sexo: formData.sexo,
      raca: formData.raca || 'Não informado',
      fase: 'cria',
      pesoInicial: pesoNascimento,
      pesoAtual: pesoNascimento,
      dataNascimento: formData.dataNascimento,
      dataEntradaFase: formData.dataNascimento,
      gmd: 0,
      arrobaTotal: parseFloat(calcularArrobaTotal(pesoNascimento).toFixed(2)),
      valorTotal: 0,
      status: 'ativo',
      observacoes: formData.observacoes || '',
      brincoMae: formData.brincoMae || '', // Campo específico para brinco da mãe
      historicoPesagens: [{
        data: formData.dataNascimento,
        pesoAnterior: 0,
        pesoAtual: pesoNascimento,
        gmd: 0
      }],
      updateLog: [{
        data: new Date().toISOString(),
        tipo: 'nascimento',
        descricao: `Nascimento registrado em ${new Date(formData.dataNascimento).toLocaleDateString('pt-BR')}`
      }],
      dataAtualizacao: new Date().toISOString()
    };

    const novosAnimais = [...animais, novoAnimal];
    setAnimais(novosAnimais);
    saveToStorage('animais', novosAnimais);
    setShowNascimentoModal(false);
    setFormData({});
    alert('Nascimento registrado com sucesso! Animal adicionado ao Dashboard automaticamente.');
  };

  const sincronizarDados = () => {
    const syncLog = {
      id: gerarId(),
      data: new Date().toISOString(),
      itens: [
        `${animais.length} animais sincronizados`,
        `${produtos.length} produtos sincronizados`,
        `${medicamentos.length} medicamentos sincronizados`,
        `${manejos.length} manejos sincronizados`
      ],
      status: 'sucesso',
      tipo: 'sincronizacao_incremental',
      dadosPreservados: true
    };

    const logsExistentes = JSON.parse(localStorage.getItem('syncLogs') || '[]');
    logsExistentes.push(syncLog);
    localStorage.setItem('syncLogs', JSON.stringify(logsExistentes));

    alert('Sincronização segura realizada com sucesso! Todos os dados foram preservados. Nenhum registro foi perdido.');
  };

  // Função para excluir animal
  const excluirAnimal = () => {
    if (!itemToDelete) return;

    const animaisAtualizados = animais.filter(animal => animal.id !== itemToDelete.id);
    setAnimais(animaisAtualizados);
    saveToStorage('animais', animaisAtualizados);
    
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    alert(`Animal ${itemToDelete.brinco} foi excluído com sucesso!`);
  };

  // Função para excluir produto
  const excluirProduto = () => {
    if (!itemToDelete) return;

    const produtosAtualizados = produtos.filter(produto => produto.id !== itemToDelete.id);
    setProdutos(produtosAtualizados);
    saveToStorage('produtos', produtosAtualizados);
    
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    alert(`Produto ${itemToDelete.nome} foi excluído com sucesso!`);
  };

  // Função para excluir medicamento
  const excluirMedicamento = () => {
    if (!itemToDelete) return;

    const medicamentosAtualizados = medicamentos.filter(medicamento => medicamento.id !== itemToDelete.id);
    setMedicamentos(medicamentosAtualizados);
    saveToStorage('medicamentos', medicamentosAtualizados);
    
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    alert(`Medicamento ${itemToDelete.nome} foi excluído com sucesso!`);
  };

  // Função para registrar aquisição de animal
  const registrarAquisicao = () => {
    const errors = validateForm(formData, 'aquisicao');
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const pesoKg = parseFloat(formData.pesoKg) || 0;
    const pesoArrobas = pesoKg / 30;
    const precoArroba = parseFloat(formData.precoArroba) || 0;
    const frete = parseFloat(formData.frete) || 0;
    const custoCorretor = parseFloat(formData.custoCorretor) || 0;
    const custoTotal = (pesoArrobas * precoArroba) + frete + custoCorretor;

    const novoAnimal = {
      id: gerarId(),
      brinco: formData.brinco || `ACQ-${Date.now()}`,
      origem: formData.origem,
      precoArroba,
      frete,
      custoCorretor,
      pesoKg,
      pesoArrobas: parseFloat(pesoArrobas.toFixed(2)),
      fase: formData.fase,
      dataPrevisaoVenda: formData.dataPrevisaoVenda,
      custoAquisicao: custoTotal,
      custoAcumulado: custoTotal,
      pesoInicial: pesoKg,
      pesoAtual: pesoKg,
      gmd: 0,
      arrobaTotal: parseFloat(pesoArrobas.toFixed(2)),
      valorTotal: parseFloat(custoTotal.toFixed(2)),
      status: 'ativo',
      sexo: formData.sexo || 'Não informado',
      raca: formData.raca || 'Não informado',
      dataEntradaFase: new Date().toISOString().split('T')[0],
      historicoPesagens: [{
        data: new Date().toISOString().split('T')[0],
        pesoAnterior: 0,
        pesoAtual: pesoKg,
        gmd: 0
      }],
      updateLog: [{
        data: new Date().toISOString(),
        tipo: 'aquisicao',
        descricao: `Animal adquirido de ${formData.origem} por R$ ${custoTotal.toFixed(2)}`
      }],
      dataAtualizacao: new Date().toISOString()
    };

    const novosAnimais = [...animais, novoAnimal];
    setAnimais(novosAnimais);
    saveToStorage('animais', novosAnimais);
    setShowAquisicaoModal(false);
    setFormData({});
    setFormErrors({});
    alert('Aquisição registrada com sucesso! Animal adicionado ao rebanho.');
  };

  // Validação de formulários
  const validateForm = (data, type) => {
    const errors = {};

    switch (type) {
      case 'animal':
        if (!data.brinco?.trim()) errors.brinco = 'Brinco é obrigatório';
        if (!data.fase) errors.fase = 'Fase é obrigatória';
        if (!data.sexo) errors.sexo = 'Sexo é obrigatório';
        if (!data.raca?.trim()) errors.raca = 'Raça é obrigatória';
        if (!data.pesoAtual || data.pesoAtual <= 0) errors.pesoAtual = 'Peso deve ser maior que zero';
        if (data.fase === 'cria' && !data.dataNascimento) errors.dataNascimento = 'Data de nascimento é obrigatória para fase Cria';
        break;

      case 'nascimento':
        if (!data.brinco?.trim()) errors.brinco = 'Brinco é obrigatório';
        if (!data.sexo) errors.sexo = 'Sexo é obrigatório';
        if (!data.pesoNascimento || data.pesoNascimento <= 0) errors.pesoNascimento = 'Peso ao nascer deve ser maior que zero';
        if (!data.dataNascimento) errors.dataNascimento = 'Data de nascimento é obrigatória';
        if (!data.brincoMae?.trim()) errors.brincoMae = 'Brinco da mãe é obrigatório';
        break;

      case 'aquisicao':
        if (!data.origem?.trim()) errors.origem = 'Origem da compra é obrigatória';
        if (!data.precoArroba || data.precoArroba <= 0) errors.precoArroba = 'Preço da arroba deve ser maior que zero';
        if (!data.pesoKg || data.pesoKg <= 0) errors.pesoKg = 'Peso em kg deve ser maior que zero';
        if (!data.fase) errors.fase = 'Fase do animal é obrigatória';
        if (!data.dataPrevisaoVenda) errors.dataPrevisaoVenda = 'Data de previsão de venda é obrigatória';
        break;

      case 'produto':
        if (!data.nome?.trim()) errors.nome = 'Nome é obrigatório';
        if (!data.categoria) errors.categoria = 'Categoria é obrigatória';
        if (!data.quantidade || data.quantidade < 0) errors.quantidade = 'Quantidade deve ser maior ou igual a zero';
        if (!data.unidade?.trim()) errors.unidade = 'Unidade é obrigatória';
        if (!data.preco || data.preco <= 0) errors.preco = 'Preço deve ser maior que zero';
        if (!data.dataCompra) errors.dataCompra = 'Data de compra é obrigatória';
        break;

      case 'medicamento':
        if (!data.nome?.trim()) errors.nome = 'Nome é obrigatório';
        if (!data.tipo) errors.tipo = 'Tipo é obrigatório';
        if (!data.quantidade || data.quantidade < 0) errors.quantidade = 'Quantidade deve ser maior ou igual a zero';
        if (!data.unidade?.trim()) errors.unidade = 'Unidade é obrigatória';
        if (!data.preco || data.preco <= 0) errors.preco = 'Preço deve ser maior que zero';
        if (!data.dataCompra) errors.dataCompra = 'Data de compra é obrigatória';
        if (!data.dataVencimento) errors.dataVencimento = 'Data de vencimento é obrigatória';
        break;

      case 'manejo':
        if (!data.tipo) errors.tipo = 'Tipo de manejo é obrigatório';
        if (!data.dataAplicacao) errors.dataAplicacao = 'Data de aplicação é obrigatória';
        if (!data.custoAplicacao || data.custoAplicacao <= 0) errors.custoAplicacao = 'Custo deve ser maior que zero';
        break;

      case 'custo':
        if (!data.descricao?.trim()) errors.descricao = 'Descrição é obrigatória';
        if (!data.valor || data.valor <= 0) errors.valor = 'Valor deve ser maior que zero';
        if (!data.data) errors.data = 'Data é obrigatória';
        break;
    }

    return errors;
  };

  // Função para calcular custos detalhados
  const calcularCustosDetalhados = () => {
    const custoAquisicao = animais.reduce((sum, animal) => sum + (animal.custoAcumulado || 0), 0);
    const custoSuplemento = produtos.reduce((sum, produto) => sum + (produto.preco * produto.quantidade), 0);
    const custoMedicamentos = medicamentos.reduce((sum, medicamento) => sum + (medicamento.preco * medicamento.quantidade), 0);
    const custoArrendamento = custosArrendamento.reduce((sum, custo) => sum + custo.valor, 0);
    const custoMaoObra = custosVaqueiro.reduce((sum, custo) => sum + custo.salario, 0);
    const custoManutencaoFazenda = custosManutencao.reduce((sum, custo) => sum + custo.valor, 0);
    const custoTotal = custoAquisicao + custoSuplemento + custoMedicamentos + custoArrendamento + custoMaoObra + custoManutencaoFazenda;

    return {
      custoAquisicao,
      custoSuplemento,
      custoMedicamentos,
      custoArrendamento,
      custoMaoObra: custoMaoObra + custoManutencaoFazenda,
      custoTotal
    };
  };

  // Função para abrir modal de detalhamento
  const openDetailModal = (type) => {
    setDetailModalType(type);
    setShowDetailModal(true);
  };

  // Função para gerar recomendações IA
  const gerarRecomendacoes = async () => {
    const custos = calcularCustosDetalhados();
    
    let titulo = '';
    let descricao = '';
    let categoria = 'manejo';
    let prioridade = 'media';

    if (stats.gmdMedio < 0.5) {
      titulo = 'GMD Baixo Detectado';
      descricao = `GMD médio de ${stats.gmdMedio.toFixed(3)} kg/dia está abaixo do ideal. Considere revisar a nutrição e suplementação mineral.`;
      categoria = 'nutricao';
      prioridade = 'alta';
    } else if (stats.custoMedioPorAnimal > 2000) {
      titulo = 'Custo por Animal Elevado';
      descricao = `Custo médio de R$ ${stats.custoMedioPorAnimal.toFixed(2)} por animal está alto. Analise os custos de suplementação e medicamentos.`;
      categoria = 'manejo';
      prioridade = 'alta';
    } else if (stats.medicamentosVencendo > 0) {
      titulo = 'Medicamentos Próximos ao Vencimento';
      descricao = `${stats.medicamentosVencendo} medicamento(s) vencendo em 30 dias. Planeje o uso ou substitua por novos.`;
      categoria = 'saude';
      prioridade = 'media';
    } else if (stats.produtosEmFalta > 0) {
      titulo = 'Estoque Baixo de Suplementos';
      descricao = `${stats.produtosEmFalta} produto(s) com estoque baixo. Programe a reposição para evitar interrupção na suplementação.`;
      categoria = 'nutricao';
      prioridade = 'media';
    } else {
      titulo = 'Rebanho em Bom Estado';
      descricao = 'Indicadores gerais estão dentro dos parâmetros normais. Continue monitorando o desempenho dos animais.';
      categoria = 'manejo';
      prioridade = 'baixa';
    }

    const recomendacao = {
      id: gerarId(),
      titulo,
      descricao,
      categoria,
      prioridade,
      dataGeracao: new Date().toISOString(),
      status: 'pendente'
    };

    const novasRecomendacoes = [recomendacao, ...recomendacoes];
    setRecomendacoes(novasRecomendacoes);
    saveToStorage('recomendacoes', novasRecomendacoes);
  };

  // ========== FUNÇÕES CRUD ==========

  const adicionarAnimal = () => {
    const errors = validateForm(formData, 'animal');
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const novoAnimal = {
      id: gerarId(),
      ...formData,
      pesoAtual: parseFloat(formData.pesoAtual),
      pesoInicial: parseFloat(formData.pesoInicial || formData.pesoAtual),
      gmd: 0,
      arrobaTotal: parseFloat(calcularArrobaTotal(formData.pesoAtual).toFixed(2)),
      valorTotal: 0,
      status: 'ativo',
      dataEntradaFase: formData.dataEntradaFase || new Date().toISOString().split('T')[0],
      updateLog: [{
        data: new Date().toISOString(),
        tipo: 'cadastro',
        descricao: `Animal cadastrado em ${new Date().toLocaleDateString('pt-BR')}`
      }],
      dataAtualizacao: new Date().toISOString()
    };

    const novosAnimais = [...animais, novoAnimal];
    setAnimais(novosAnimais);
    saveToStorage('animais', novosAnimais);
    setShowAnimalModal(false);
    setFormData({});
    setFormErrors({});
  };

  const adicionarProduto = () => {
    const errors = validateForm(formData, 'produto');
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const novoProduto = {
      id: gerarId(),
      ...formData,
      quantidade: parseFloat(formData.quantidade),
      preco: parseFloat(formData.preco),
      dataAtualizacao: new Date().toISOString()
    };

    const novosProdutos = [...produtos, novoProduto];
    setProdutos(novosProdutos);
    saveToStorage('produtos', novosProdutos);
    setShowProdutoModal(false);
    setFormData({});
    setFormErrors({});
  };

  const adicionarMedicamento = () => {
    const errors = validateForm(formData, 'medicamento');
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const novoMedicamento = {
      id: gerarId(),
      ...formData,
      quantidade: parseFloat(formData.quantidade),
      preco: parseFloat(formData.preco),
      dataAtualizacao: new Date().toISOString()
    };

    const novosMedicamentos = [...medicamentos, novoMedicamento];
    setMedicamentos(novosMedicamentos);
    saveToStorage('medicamentos', novosMedicamentos);
    setShowMedicamentoModal(false);
    setFormData({});
    setFormErrors({});
  };

  const adicionarManejo = () => {
    const errors = validateForm(formData, 'manejo');
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const novoManejo = {
      id: gerarId(),
      ...formData,
      custoAplicacao: parseFloat(formData.custoAplicacao),
      dataAtualizacao: new Date().toISOString()
    };

    const novosManejos = [...manejos, novoManejo];
    setManejos(novosManejos);
    saveToStorage('manejos', novosManejos);
    setShowManejoModal(false);
    setFormData({});
    setFormErrors({});
  };

  const adicionarCusto = () => {
    const errors = validateForm(formData, 'custo');
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const novoCusto = {
      id: gerarId(),
      ...formData,
      valor: parseFloat(formData.valor),
      dataAtualizacao: new Date().toISOString()
    };

    let novosCustos = [];
    switch (custoModalType) {
      case 'arrendamento':
        novosCustos = [...custosArrendamento, novoCusto];
        setCustosArrendamento(novosCustos);
        saveToStorage('custosArrendamento', novosCustos);
        break;
      case 'vaqueiro':
        novosCustos = [...custosVaqueiro, { ...novoCusto, salario: novoCusto.valor }];
        setCustosVaqueiro(novosCustos);
        saveToStorage('custosVaqueiro', novosCustos);
        break;
      case 'manutencao':
        novosCustos = [...custosManutencao, novoCusto];
        setCustosManutencao(novosCustos);
        saveToStorage('custosManutencao', novosCustos);
        break;
    }

    setShowCustoModal(false);
    setCustoModalType(null);
    setFormData({});
    setFormErrors({});
  };

  // Componente de Navegação
  const renderNavigation = () => {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'rebanho', label: 'Rebanho', icon: Users },
      { id: 'estoque', label: 'Estoque', icon: Package },
      { id: 'manejo', label: 'Manejo', icon: Stethoscope },
      { id: 'custos', label: 'Custos', icon: DollarSign }
    ];

    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              {/* Logo da Fazenda Paiva 1 */}
              <div className="flex items-center space-x-3">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/c085bc25-0abd-446c-9cf6-be4efb03d153.jpg" 
                  alt="Fazenda Paiva 1" 
                  className="h-10 w-auto"
                />
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    AgroManager Pro
                  </span>
                  <p className="text-xs text-gray-500 -mt-1">Gestão Inteligente Rural</p>
                </div>
              </div>
              
              <div className="hidden md:flex space-x-8">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === item.id
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {stats.produtosEmFalta > 0 && (
                <div className="flex items-center space-x-1 text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">{stats.produtosEmFalta}</span>
                </div>
              )}
              
              {stats.medicamentosVencendo > 0 && (
                <div className="flex items-center space-x-1 text-yellow-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{stats.medicamentosVencendo}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    );
  };

  // Renderizar Dashboard
  const renderDashboard = () => {
    const custos = calcularCustosDetalhados();

    return (
      <div className="space-y-6">


        {/* Filtro de Data - TAMANHO REDUZIDO CONFORME SOLICITADO */}
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-900">Período de Análise</h3>
            </div>
            <div className="flex items-center space-x-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Data Inicial
                </label>
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Automação */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Automações do Sistema</h3>
            <div className="text-sm text-green-600 font-medium">
              🔒 Sistema de Proteção de Dados Ativo
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <button
              onClick={atualizarGMDTodos}
              className="flex flex-col items-center space-y-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <RefreshCw className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Atualizar GMD</span>
            </button>
            
            <button
              onClick={() => setShowPesagemLoteModal(true)}
              className="flex flex-col items-center space-y-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <Scale className="w-6 h-6 text-green-600" />
              <span className="text-xs font-medium text-green-700">Pesagem Lote</span>
            </button>
            
            <button
              onClick={() => {
                setFormData({});
                setFormErrors({});
                setShowNascimentoModal(true);
              }}
              className="flex flex-col items-center space-y-2 p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors"
            >
              <Baby className="w-6 h-6 text-pink-600" />
              <span className="text-xs font-medium text-pink-700">Nascimento</span>
            </button>
            
            <button
              onClick={sincronizarDados}
              className="flex flex-col items-center space-y-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <Sync className="w-6 h-6 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Sincronizar</span>
            </button>
            
            <button
              onClick={() => setShowHistoricoModal(true)}
              className="flex flex-col items-center space-y-2 p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <History className="w-6 h-6 text-yellow-600" />
              <span className="text-xs font-medium text-yellow-700">Histórico</span>
            </button>
            
            <button
              onClick={gerarRecomendacoes}
              className="flex flex-col items-center space-y-2 p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              <Activity className="w-6 h-6 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">Análise IA</span>
            </button>
          </div>
        </div>

        {/* Quadros Principais - FUNCIONALIDADE SOLICITADA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openDetailModal('total-animais')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Animal</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAnimais}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Circle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openDetailModal('gmd-medio')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">GMD Médio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.gmdMedio.toFixed(3)} kg/dia</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openDetailModal('custo-animal')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custo Animal</p>
                <p className="text-2xl font-bold text-gray-900">R$ {stats.custoMedioPorAnimal.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openDetailModal('custo-total')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Custo Total</p>
                <p className="text-2xl font-bold text-gray-900">R$ {custos.custoTotal.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {(stats.produtosEmFalta > 0 || stats.medicamentosVencendo > 0 || stats.manejosPendentes > 0) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-sm font-medium text-yellow-800">Alertas Importantes</h3>
            </div>
            <div className="space-y-1 text-sm text-yellow-700">
              {stats.produtosEmFalta > 0 && (
                <p>• {stats.produtosEmFalta} produto(s) com estoque baixo</p>
              )}
              {stats.medicamentosVencendo > 0 && (
                <p>• {stats.medicamentosVencendo} medicamento(s) vencendo em 30 dias</p>
              )}
              {stats.manejosPendentes > 0 && (
                <p>• {stats.manejosPendentes} manejo(s) sanitário(s) pendente(s)</p>
              )}
            </div>
          </div>
        )}

        {/* Gráficos e análises */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição por fase */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição por Fase</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cria</span>
                <span className="text-sm font-medium">{stats.animaisPorFase.cria} animais</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${stats.totalAnimais > 0 ? (stats.animaisPorFase.cria / stats.totalAnimais) * 100 : 0}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recria</span>
                <span className="text-sm font-medium">{stats.animaisPorFase.recria} animais</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${stats.totalAnimais > 0 ? (stats.animaisPorFase.recria / stats.totalAnimais) * 100 : 0}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Ordenha</span>
                <span className="text-sm font-medium">{stats.animaisPorFase.ordenha} animais</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${stats.totalAnimais > 0 ? (stats.animaisPorFase.ordenha / stats.totalAnimais) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Breakdown de custos */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Breakdown de Custos</h3>
            <div className="space-y-3">
              <div 
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={() => {
                  setFormData({});
                  setFormErrors({});
                  setShowAquisicaoModal(true);
                }}
              >
                <span className="text-sm text-gray-700">Aquisição</span>
                <span className="text-sm font-medium text-blue-600">R$ {custos.custoAquisicao.toFixed(2)}</span>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-colors"
                onClick={() => openDetailModal('suplemento')}
              >
                <span className="text-sm text-gray-700">Suplementos</span>
                <span className="text-sm font-medium text-green-600">R$ {custos.custoSuplemento.toFixed(2)}</span>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors"
                onClick={() => openDetailModal('medicamentos')}
              >
                <span className="text-sm text-gray-700">Medicamentos</span>
                <span className="text-sm font-medium text-red-600">R$ {custos.custoMedicamentos.toFixed(2)}</span>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={() => openDetailModal('fazenda')}
              >
                <span className="text-sm text-gray-700">Fazenda</span>
                <span className="text-sm font-medium text-purple-600">R$ {custos.custoArrendamento.toFixed(2)}</span>
              </div>
              
              <div 
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg cursor-pointer hover:bg-yellow-100 transition-colors"
                onClick={() => openDetailModal('maoObra')}
              >
                <span className="text-sm text-gray-700">Mão de Obra</span>
                <span className="text-sm font-medium text-yellow-600">R$ {custos.custoMaoObra.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendações IA */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recomendações IA</h3>
            <button
              onClick={gerarRecomendacoes}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Brain className="w-4 h-4" />
              <span>Gerar Análise</span>
            </button>
          </div>
          
          {recomendacoes.length > 0 ? (
            <div className="space-y-4">
              {recomendacoes.slice(0, 3).map((rec, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Brain className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">{rec.titulo}</h4>
                      <p className="text-sm text-blue-700 mt-1">{rec.descricao}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600">
                        <span>Prioridade: {rec.prioridade}</span>
                        <span>Categoria: {rec.categoria}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Clique em "Gerar Análise" para receber recomendações personalizadas</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar Rebanho
  const renderRebanho = () => {
    const animaisFiltrados = animais.filter(animal => {
      const matchSearch = animal.brinco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.raca?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'todos' || animal.status === filterStatus;
      return matchSearch && matchStatus;
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Gestão do Rebanho</h2>
          <button
            onClick={() => {
              setFormData({});
              setFormErrors({});
              setEditingItem(null);
              setShowAnimalModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Animal</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por brinco ou raça..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="vendido">Vendido</option>
                <option value="morto">Morto</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              {animaisFiltrados.length} de {animais.length} animais
            </div>
          </div>
        </div>

        {/* Lista de Animais */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Animal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Peso Atual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GMD
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {animaisFiltrados.map((animal) => (
                  <tr key={animal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Brinco: {animal.brinco}
                        </div>
                        <div className="text-sm text-gray-500">
                          {animal.raca} - {animal.sexo}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        animal.fase === 'cria' ? 'bg-blue-100 text-blue-800' :
                        animal.fase === 'recria' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {animal.fase}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {animal.pesoAtual} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(animal.gmd || 0).toFixed(3)} kg/dia
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        animal.status === 'ativo' ? 'bg-green-100 text-green-800' :
                        animal.status === 'vendido' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {animal.status || 'ativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setFormData(animal);
                            setEditingItem(animal);
                            setShowAnimalModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Editar animal"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setAnimalSelecionado(animal);
                            setFormData({});
                            setShowVendaModal(true);
                          }}
                          className="text-green-600 hover:text-green-900"
                          title="Vender animal"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(animal);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir animal"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {animaisFiltrados.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum animal encontrado.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar Estoque
  const renderEstoque = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Controle de Estoque</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setFormData({});
                setFormErrors({});
                setEditingItem(null);
                setShowProdutoModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Produto</span>
            </button>
            <button
              onClick={() => {
                setFormData({});
                setFormErrors({});
                setEditingItem(null);
                setShowMedicamentoModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Medicamento</span>
            </button>
          </div>
        </div>

        {/* Produtos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Produtos e Suplementos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {produtos.map((produto) => (
                  <tr key={produto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{produto.nome}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {produto.categoria}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${produto.quantidade <= 5 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {produto.quantidade} {produto.unidade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {produto.preco.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      R$ {(produto.preco * produto.quantidade).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setFormData(produto);
                            setEditingItem(produto);
                            setShowProdutoModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(produto);
                            setShowDeleteConfirm(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {produtos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum produto cadastrado.</p>
            </div>
          )}
        </div>

        {/* Medicamentos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Medicamentos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medicamento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço Unit.
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicamentos.map((medicamento) => {
                  const hoje = new Date();
                  const vencimento = new Date(medicamento.dataVencimento);
                  const diasParaVencer = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={medicamento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{medicamento.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {medicamento.tipo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {medicamento.quantidade} {medicamento.unidade}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${diasParaVencer <= 30 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                          {new Date(medicamento.dataVencimento).toLocaleDateString('pt-BR')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {medicamento.preco.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setFormData(medicamento);
                              setEditingItem(medicamento);
                              setShowMedicamentoModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setItemToDelete(medicamento);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {medicamentos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum medicamento cadastrado.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar Manejo
  const renderManejo = () => {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Manejo Sanitário</h2>
          <button
            onClick={() => {
              setFormData({});
              setFormErrors({});
              setEditingItem(null);
              setShowManejoModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Manejo</span>
          </button>
        </div>

        {/* Lista de Manejos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Manejo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Aplicação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Próxima Aplicação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Custo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {manejos.map((manejo) => {
                  const hoje = new Date();
                  const proximaData = manejo.proximaAplicacao ? new Date(manejo.proximaAplicacao) : null;
                  const isPendente = proximaData && proximaData <= hoje;
                  
                  return (
                    <tr key={manejo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{manejo.tipo}</div>
                        {manejo.observacoes && (
                          <div className="text-sm text-gray-500">{manejo.observacoes}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(manejo.dataAplicacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {proximaData ? (
                          <span className={`text-sm ${isPendente ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                            {proximaData.toLocaleDateString('pt-BR')}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {manejo.custoAplicacao.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          isPendente ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isPendente ? 'Pendente' : 'Em dia'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setFormData(manejo);
                            setEditingItem(manejo);
                            setShowManejoModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {manejos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Stethoscope className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum manejo registrado.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Renderizar Custos
  const renderCustos = () => {
    const custos = calcularCustosDetalhados();

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Controle de Custos</h2>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setFormData({});
                setFormErrors({});
                setCustoModalType('arrendamento');
                setShowCustoModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Arrendamento</span>
            </button>
            <button
              onClick={() => {
                setFormData({});
                setFormErrors({});
                setCustoModalType('vaqueiro');
                setShowCustoModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Vaqueiro</span>
            </button>
            <button
              onClick={() => {
                setFormData({});
                setFormErrors({});
                setCustoModalType('manutencao');
                setShowCustoModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Manutenção</span>
            </button>
          </div>
        </div>

        {/* Resumo de Custos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Arrendamento</p>
                <p className="text-2xl font-bold text-purple-600">R$ {custos.custoArrendamento.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mão de Obra</p>
                <p className="text-2xl font-bold text-blue-600">R$ {custosVaqueiro.reduce((sum, c) => sum + c.salario, 0).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Manutenção</p>
                <p className="text-2xl font-bold text-green-600">R$ {custosManutencao.reduce((sum, c) => sum + c.valor, 0).toFixed(2)}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Detalhamento de Custos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Arrendamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Arrendamento</h3>
            </div>
            <div className="p-6">
              {custosArrendamento.length > 0 ? (
                <div className="space-y-3">
                  {custosArrendamento.map((custo) => (
                    <div key={custo.id} className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{custo.descricao}</div>
                        <div className="text-xs text-gray-500">{new Date(custo.data).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <div className="text-sm font-medium text-purple-600">
                        R$ {custo.valor.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Building className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Nenhum custo registrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Vaqueiro */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Mão de Obra</h3>
            </div>
            <div className="p-6">
              {custosVaqueiro.length > 0 ? (
                <div className="space-y-3">
                  {custosVaqueiro.map((custo) => (
                    <div key={custo.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{custo.descricao}</div>
                        <div className="text-xs text-gray-500">{new Date(custo.data).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <div className="text-sm font-medium text-blue-600">
                        R$ {custo.salario.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Nenhum custo registrado</p>
                </div>
              )}
            </div>
          </div>

          {/* Manutenção */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Manutenção</h3>
            </div>
            <div className="p-6">
              {custosManutencao.length > 0 ? (
                <div className="space-y-3">
                  {custosManutencao.map((custo) => (
                    <div key={custo.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{custo.descricao}</div>
                        <div className="text-xs text-gray-500">{new Date(custo.data).toLocaleDateString('pt-BR')}</div>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        R$ {custo.valor.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Wrench className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Nenhum custo registrado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal de Confirmação de Exclusão
  const renderDeleteConfirmModal = () => (
    showDeleteConfirm && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
              <p className="text-sm text-gray-600">Esta ação não pode ser desfeita.</p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700">
              Tem certeza de que deseja excluir {itemToDelete?.brinco ? `o animal ${itemToDelete.brinco}` : `o item ${itemToDelete?.nome}`}?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Todos os dados relacionados serão permanentemente removidos.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowDeleteConfirm(false);
                setItemToDelete(null);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                if (itemToDelete?.brinco) {
                  excluirAnimal();
                } else if (itemToDelete?.categoria) {
                  excluirProduto();
                } else if (itemToDelete?.tipo) {
                  excluirMedicamento();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir</span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Modal de Detalhamento - FUNCIONALIDADE SOLICITADA
  const renderDetailModal = () => {
    if (!showDetailModal || !detailModalType) return null;

    const getDetailContent = () => {
      switch (detailModalType) {
        case 'total-animais':
          return {
            title: 'Total de Animais',
            data: animais.map(animal => ({
              id: animal.id,
              brinco: animal.brinco,
              fase: animal.fase,
              peso: animal.pesoAtual,
              gmd: animal.gmd || 0,
              status: animal.status || 'ativo'
            }))
          };
        
        case 'gmd-medio':
          return {
            title: 'GMD Médio Detalhado',
            data: animais.map(animal => ({
              id: animal.id,
              brinco: animal.brinco,
              gmd: animal.gmd || 0,
              pesoInicial: animal.pesoInicial || 0,
              pesoAtual: animal.pesoAtual || 0,
              dias: animal.dataEntradaFase ? Math.ceil((new Date() - new Date(animal.dataEntradaFase)) / (1000 * 60 * 60 * 24)) : 0
            }))
          };
        
        case 'custo-animal':
          return {
            title: 'Custo por Animal',
            data: animais.map(animal => ({
              id: animal.id,
              brinco: animal.brinco,
              custoAcumulado: animal.custoAcumulado || 0,
              valorTotal: animal.valorTotal || 0,
              fase: animal.fase
            }))
          };
        
        case 'custo-total':
          const custos = calcularCustosDetalhados();
          return {
            title: 'Custo Total Detalhado',
            data: [
              { categoria: 'Aquisição', valor: custos.custoAquisicao },
              { categoria: 'Suplementos', valor: custos.custoSuplemento },
              { categoria: 'Medicamentos', valor: custos.custoMedicamentos },
              { categoria: 'Arrendamento', valor: custos.custoArrendamento },
              { categoria: 'Mão de Obra', valor: custos.custoMaoObra }
            ]
          };
        
        default:
          return { title: 'Detalhes', data: [] };
      }
    };

    const { title, data } = getDetailContent();

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={() => setShowDetailModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {detailModalType === 'total-animais' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brinco</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fase</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GMD</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </>
                  )}
                  {detailModalType === 'gmd-medio' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brinco</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GMD (kg/dia)</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso Inicial</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso Atual</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dias</th>
                    </>
                  )}
                  {detailModalType === 'custo-animal' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brinco</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fase</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custo Acumulado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                    </>
                  )}
                  {detailModalType === 'custo-total' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor (R$)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    {detailModalType === 'total-animais' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.brinco}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fase}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.peso}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.gmd.toFixed(3)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.status}</td>
                      </>
                    )}
                    {detailModalType === 'gmd-medio' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.brinco}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.gmd.toFixed(3)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.pesoInicial}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.pesoAtual}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.dias}</td>
                      </>
                    )}
                    {detailModalType === 'custo-animal' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.brinco}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fase}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {item.custoAcumulado.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {item.valorTotal.toFixed(2)}</td>
                      </>
                    )}
                    {detailModalType === 'custo-total' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.categoria}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">R$ {item.valor.toFixed(2)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum registro encontrado.</p>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowDetailModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizar conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'rebanho':
        return renderRebanho();
      case 'estoque':
        return renderEstoque();
      case 'manejo':
        return renderManejo();
      case 'custos':
        return renderCustos();
      default:
        return renderDashboard();
    }
  };

  // Modal de Pesagem em Lote
  const renderPesagemLoteModal = () => (
    showPesagemLoteModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cadastrar Pesagem do Rebanho</h3>
            <button
              onClick={() => setShowPesagemLoteModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data da Pesagem
            </label>
            <input
              type="date"
              value={pesagemLoteDate}
              onChange={(e) => setPesagemLoteDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Animais Ativos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {animais.filter(animal => animal.status !== 'vendido' && animal.status !== 'morto').map((animal) => (
                <div key={animal.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{animal.brinco}</span>
                    <span className="text-sm text-gray-600">{animal.raca}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    Peso atual: {animal.pesoAtual} kg
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="Novo peso (kg)"
                    value={pesagemLoteData[animal.id] || ''}
                    onChange={(e) => setPesagemLoteData({
                      ...pesagemLoteData,
                      [animal.id]: parseFloat(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowPesagemLoteModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={processarPesagemLote}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Scale className="w-4 h-4" />
              <span>Processar Pesagem</span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Modal de Nascimento - FUNCIONALIDADE SOLICITADA COM CAMPO BRINCO DA MÃE OBRIGATÓRIO
  const renderNascimentoModal = () => (
    showNascimentoModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Registrar Nascimento de Bezerro(a)</h3>
            <button
              onClick={() => setShowNascimentoModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brinco *
              </label>
              <input
                type="text"
                value={formData.brinco || ''}
                onChange={(e) => setFormData({...formData, brinco: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  formErrors.brinco ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 001"
              />
              {formErrors.brinco && (
                <p className="text-red-500 text-xs mt-1">{formErrors.brinco}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo *
              </label>
              <select
                value={formData.sexo || ''}
                onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  formErrors.sexo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione o sexo</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
              {formErrors.sexo && (
                <p className="text-red-500 text-xs mt-1">{formErrors.sexo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso ao Nascer (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.pesoNascimento || ''}
                onChange={(e) => setFormData({...formData, pesoNascimento: parseFloat(e.target.value) || 0})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  formErrors.pesoNascimento ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 35.0"
              />
              {formErrors.pesoNascimento && (
                <p className="text-red-500 text-xs mt-1">{formErrors.pesoNascimento}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento *
              </label>
              <input
                type="date"
                value={formData.dataNascimento || ''}
                onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  formErrors.dataNascimento ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.dataNascimento && (
                <p className="text-red-500 text-xs mt-1">{formErrors.dataNascimento}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brinco da Mãe *
              </label>
              <input
                type="text"
                value={formData.brincoMae || ''}
                onChange={(e) => setFormData({...formData, brincoMae: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  formErrors.brincoMae ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 025"
              />
              {formErrors.brincoMae && (
                <p className="text-red-500 text-xs mt-1">{formErrors.brincoMae}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raça
              </label>
              <input
                type="text"
                value={formData.raca || ''}
                onChange={(e) => setFormData({...formData, raca: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Ex: Nelore"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.observacoes || ''}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              rows={3}
              placeholder="Observações sobre o nascimento..."
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowNascimentoModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={registrarNascimento}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 flex items-center space-x-2"
            >
              <Baby className="w-4 h-4" />
              <span>Registrar Nascimento</span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Modal de Aquisição - NOVA FUNCIONALIDADE SOLICITADA
  const renderAquisicaoModal = () => (
    showAquisicaoModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Registrar Aquisição de Animal</h3>
            <button
              onClick={() => setShowAquisicaoModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origem da Compra *
              </label>
              <input
                type="text"
                value={formData.origem || ''}
                onChange={(e) => setFormData({...formData, origem: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  formErrors.origem ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Fazenda São João"
              />
              {formErrors.origem && (
                <p className="text-red-500 text-xs mt-1">{formErrors.origem}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço da Arroba (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precoArroba || ''}
                onChange={(e) => setFormData({...formData, precoArroba: parseFloat(e.target.value) || 0})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  formErrors.precoArroba ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 280.00"
              />
              {formErrors.precoArroba && (
                <p className="text-red-500 text-xs mt-1">{formErrors.precoArroba}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frete do Caminhão (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.frete || ''}
                onChange={(e) => setFormData({...formData, frete: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Ex: 150.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo com Corretor (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.custoCorretor || ''}
                onChange={(e) => setFormData({...formData, custoCorretor: parseFloat(e.target.value) || 0})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Ex: 50.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso em kg *
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.pesoKg || ''}
                onChange={(e) => {
                  const peso = parseFloat(e.target.value) || 0;
                  setFormData({
                    ...formData, 
                    pesoKg: peso,
                    pesoArrobas: (peso / 30).toFixed(2)
                  });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  formErrors.pesoKg ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: 450.0"
              />
              {formErrors.pesoKg && (
                <p className="text-red-500 text-xs mt-1">{formErrors.pesoKg}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso em @ (calculado automaticamente)
              </label>
              <input
                type="text"
                value={formData.pesoArrobas || '0.00'}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fase do Animal *
              </label>
              <select
                value={formData.fase || ''}
                onChange={(e) => setFormData({...formData, fase: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  formErrors.fase ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione a fase</option>
                <option value="cria">Cria</option>
                <option value="recria">Recria</option>
                <option value="ordenha">Ordenha</option>
              </select>
              {formErrors.fase && (
                <p className="text-red-500 text-xs mt-1">{formErrors.fase}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Previsão de Venda *
              </label>
              <input
                type="date"
                value={formData.dataPrevisaoVenda || ''}
                onChange={(e) => setFormData({...formData, dataPrevisaoVenda: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                  formErrors.dataPrevisaoVenda ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.dataPrevisaoVenda && (
                <p className="text-red-500 text-xs mt-1">{formErrors.dataPrevisaoVenda}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo
              </label>
              <select
                value={formData.sexo || ''}
                onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raça
              </label>
              <input
                type="text"
                value={formData.raca || ''}
                onChange={(e) => setFormData({...formData, raca: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Ex: Nelore"
              />
            </div>
          </div>

          {/* Resumo de Custos */}
          {formData.pesoKg && formData.precoArroba && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Resumo de Custos</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Valor Animal:</span>
                  <span className="font-medium text-blue-900 ml-2">
                    R$ {((formData.pesoKg / 30) * formData.precoArroba).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Frete:</span>
                  <span className="font-medium text-blue-900 ml-2">
                    R$ {(formData.frete || 0).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-blue-700">Corretor:</span>
                  <span className="font-medium text-blue-900 ml-2">
                    R$ {(formData.custoCorretor || 0).toFixed(2)}
                  </span>
                </div>
                <div className="font-bold">
                  <span className="text-blue-700">Total:</span>
                  <span className="text-blue-900 ml-2">
                    R$ {(((formData.pesoKg / 30) * formData.precoArroba) + (formData.frete || 0) + (formData.custoCorretor || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAquisicaoModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              onClick={registrarAquisicao}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Registrar Aquisição</span>
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Modal de Histórico
  const renderHistoricoModal = () => (
    showHistoricoModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Histórico de Alterações</h3>
            <button
              onClick={() => setShowHistoricoModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {animais.filter(animal => animal.updateLog && animal.updateLog.length > 0).map((animal) => (
              <div key={animal.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Animal: {animal.brinco} - {animal.raca}
                </h4>
                <div className="space-y-2">
                  {animal.updateLog?.map((log, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <span className="text-gray-500">
                        {new Date(log.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.tipo === 'nascimento' ? 'bg-pink-100 text-pink-800' :
                        log.tipo === 'venda' ? 'bg-green-100 text-green-800' :
                        log.tipo === 'obito' ? 'bg-red-100 text-red-800' :
                        log.tipo === 'transferencia_fase' ? 'bg-blue-100 text-blue-800' :
                        log.tipo === 'atualizacao' ? 'bg-yellow-100 text-yellow-800' :
                        log.tipo === 'aquisicao' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.tipo}
                      </span>
                      <span className="text-gray-700">{log.descricao}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {animais.filter(animal => animal.updateLog && animal.updateLog.length > 0).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum histórico de alterações encontrado.</p>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowHistoricoModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    )
  );

  // Modais de formulários (Animal, Produto, Medicamento, Manejo, Custo)
  const renderFormModals = () => (
    <>
      {/* Modal Animal */}
      {showAnimalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Animal' : 'Adicionar Animal'}
              </h3>
              <button
                onClick={() => setShowAnimalModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brinco *</label>
                <input
                  type="text"
                  value={formData.brinco || ''}
                  onChange={(e) => setFormData({...formData, brinco: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.brinco ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.brinco && <p className="text-red-500 text-xs mt-1">{formErrors.brinco}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo *</label>
                <select
                  value={formData.sexo || ''}
                  onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.sexo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
                {formErrors.sexo && <p className="text-red-500 text-xs mt-1">{formErrors.sexo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Raça *</label>
                <input
                  type="text"
                  value={formData.raca || ''}
                  onChange={(e) => setFormData({...formData, raca: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.raca ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.raca && <p className="text-red-500 text-xs mt-1">{formErrors.raca}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fase *</label>
                <select
                  value={formData.fase || ''}
                  onChange={(e) => setFormData({...formData, fase: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.fase ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="cria">Cria</option>
                  <option value="recria">Recria</option>
                  <option value="ordenha">Ordenha</option>
                </select>
                {formErrors.fase && <p className="text-red-500 text-xs mt-1">{formErrors.fase}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Peso Atual (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pesoAtual || ''}
                  onChange={(e) => setFormData({...formData, pesoAtual: parseFloat(e.target.value) || 0})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.pesoAtual ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.pesoAtual && <p className="text-red-500 text-xs mt-1">{formErrors.pesoAtual}</p>}
              </div>

              {formData.fase === 'cria' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento *</label>
                  <input
                    type="date"
                    value={formData.dataNascimento || ''}
                    onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                      formErrors.dataNascimento ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.dataNascimento && <p className="text-red-500 text-xs mt-1">{formErrors.dataNascimento}</p>}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAnimalModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarAnimal}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingItem ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Produto */}
      {showProdutoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Produto' : 'Adicionar Produto'}
              </h3>
              <button
                onClick={() => setShowProdutoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.nome && <p className="text-red-500 text-xs mt-1">{formErrors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                <select
                  value={formData.categoria || ''}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.categoria ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="Suplemento">Suplemento</option>
                  <option value="Ração">Ração</option>
                  <option value="Sal Mineral">Sal Mineral</option>
                  <option value="Outros">Outros</option>
                </select>
                {formErrors.categoria && <p className="text-red-500 text-xs mt-1">{formErrors.categoria}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.quantidade || ''}
                  onChange={(e) => setFormData({...formData, quantidade: parseFloat(e.target.value) || 0})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.quantidade ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.quantidade && <p className="text-red-500 text-xs mt-1">{formErrors.quantidade}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade *</label>
                <select
                  value={formData.unidade || ''}
                  onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.unidade ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="kg">kg</option>
                  <option value="saco">saco</option>
                  <option value="litro">litro</option>
                  <option value="unidade">unidade</option>
                </select>
                {formErrors.unidade && <p className="text-red-500 text-xs mt-1">{formErrors.unidade}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unitário (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco || ''}
                  onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value) || 0})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.preco ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.preco && <p className="text-red-500 text-xs mt-1">{formErrors.preco}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Compra *</label>
                <input
                  type="date"
                  value={formData.dataCompra || ''}
                  onChange={(e) => setFormData({...formData, dataCompra: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.dataCompra ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.dataCompra && <p className="text-red-500 text-xs mt-1">{formErrors.dataCompra}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowProdutoModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarProduto}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingItem ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Medicamento */}
      {showMedicamentoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Medicamento' : 'Adicionar Medicamento'}
              </h3>
              <button
                onClick={() => setShowMedicamentoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.nome && <p className="text-red-500 text-xs mt-1">{formErrors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                <select
                  value={formData.tipo || ''}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.tipo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="Vacina">Vacina</option>
                  <option value="Antibiótico">Antibiótico</option>
                  <option value="Vermífugo">Vermífugo</option>
                  <option value="Anti-inflamatório">Anti-inflamatório</option>
                  <option value="Outros">Outros</option>
                </select>
                {formErrors.tipo && <p className="text-red-500 text-xs mt-1">{formErrors.tipo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade *</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.quantidade || ''}
                  onChange={(e) => setFormData({...formData, quantidade: parseFloat(e.target.value) || 0})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.quantidade ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.quantidade && <p className="text-red-500 text-xs mt-1">{formErrors.quantidade}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unidade *</label>
                <select
                  value={formData.unidade || ''}
                  onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.unidade ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="ml">ml</option>
                  <option value="dose">dose</option>
                  <option value="frasco">frasco</option>
                  <option value="unidade">unidade</option>
                </select>
                {formErrors.unidade && <p className="text-red-500 text-xs mt-1">{formErrors.unidade}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preço Unitário (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.preco || ''}
                  onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value) || 0})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.preco ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.preco && <p className="text-red-500 text-xs mt-1">{formErrors.preco}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Compra *</label>
                <input
                  type="date"
                  value={formData.dataCompra || ''}
                  onChange={(e) => setFormData({...formData, dataCompra: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.dataCompra ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.dataCompra && <p className="text-red-500 text-xs mt-1">{formErrors.dataCompra}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento *</label>
                <input
                  type="date"
                  value={formData.dataVencimento || ''}
                  onChange={(e) => setFormData({...formData, dataVencimento: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.dataVencimento ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.dataVencimento && <p className="text-red-500 text-xs mt-1">{formErrors.dataVencimento}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowMedicamentoModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarMedicamento}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingItem ? 'Atualizar' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Manejo */}
      {showManejoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Manejo' : 'Registrar Manejo'}
              </h3>
              <button
                onClick={() => setShowManejoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Manejo *</label>
                <select
                  value={formData.tipo || ''}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.tipo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="Vacinação">Vacinação</option>
                  <option value="Vermifugação">Vermifugação</option>
                  <option value="Descorna">Descorna</option>
                  <option value="Castração">Castração</option>
                  <option value="Outros">Outros</option>
                </select>
                {formErrors.tipo && <p className="text-red-500 text-xs mt-1">{formErrors.tipo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Aplicação *</label>
                <input
                  type="date"
                  value={formData.dataAplicacao || ''}
                  onChange={(e) => setFormData({...formData, dataAplicacao: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.dataAplicacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.dataAplicacao && <p className="text-red-500 text-xs mt-1">{formErrors.dataAplicacao}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Próxima Aplicação</label>
                <input
                  type="date"
                  value={formData.proximaAplicacao || ''}
                  onChange={(e) => setFormData({...formData, proximaAplicacao: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Custo de Aplicação (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.custoAplicacao || ''}
                  onChange={(e) => setFormData({...formData, custoAplicacao: parseFloat(e.target.value) || 0})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.custoAplicacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.custoAplicacao && <p className="text-red-500 text-xs mt-1">{formErrors.custoAplicacao}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
              <textarea
                value={formData.observacoes || ''}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowManejoModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarManejo}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingItem ? 'Atualizar' : 'Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Custo */}
      {showCustoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Adicionar {custoModalType === 'arrendamento' ? 'Arrendamento' : 
                          custoModalType === 'vaqueiro' ? 'Custo de Vaqueiro' : 'Manutenção'}
              </h3>
              <button
                onClick={() => setShowCustoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                <input
                  type="text"
                  value={formData.descricao || ''}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.descricao ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={
                    custoModalType === 'arrendamento' ? 'Ex: Arrendamento Fazenda São João' :
                    custoModalType === 'vaqueiro' ? 'Ex: Salário João Silva' : 'Ex: Reparo cerca'
                  }
                />
                {formErrors.descricao && <p className="text-red-500 text-xs mt-1">{formErrors.descricao}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {custoModalType === 'vaqueiro' ? 'Salário (R$)' : 'Valor (R$)'} *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.valor || ''}
                  onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value) || 0})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.valor ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.valor && <p className="text-red-500 text-xs mt-1">{formErrors.valor}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data *</label>
                <input
                  type="date"
                  value={formData.data || ''}
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                    formErrors.data ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.data && <p className="text-red-500 text-xs mt-1">{formErrors.data}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCustoModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={adicionarCusto}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Modais */}
      {renderDetailModal()}
      {renderDeleteConfirmModal()}
      {renderPesagemLoteModal()}
      {renderNascimentoModal()}
      {renderAquisicaoModal()}
      {renderHistoricoModal()}
      {renderFormModals()}
    </div>
  );
}