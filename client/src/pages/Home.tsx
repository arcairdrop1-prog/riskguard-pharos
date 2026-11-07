import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Clock3,
  Code2,
  Copy,
  ExternalLink,
  Fingerprint,
  Gauge,
  Info,
  Loader2,
  LockKeyhole,
  Radar,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  WalletCards,
  X,
} from "lucide-react";
import { toast } from "sonner";

type RiskLevel = "baixo" | "médio" | "alto";
type SignalStatus = "clear" | "attention" | "danger";

type Signal = {
  label: string;
  value: string;
  explanation: string;
  evidence: string;
  status: SignalStatus;
  icon: typeof Clock3;
};

type Result = {
  id: "clean" | "risky" | "mixed";
  address: string;
  kind: string;
  network: string;
  risk: RiskLevel;
  score: number;
  verdict: string;
  summary: string;
  recommendationTitle: string;
  recommendation: string;
  recommendationAction: string;
  signals: Signal[];
};

const demoAddresses = {
  clean: "0x71cA3e9B20A4f09F7f2E4B53B11bA41e",
  risky: "0xB4d9aE2F8C31f0A2b7E6C3909aD099C2",
};

const results: Record<Result["id"], Result> = {
  clean: {
    id: "clean",
    address: demoAddresses.clean,
    kind: "Carteira",
    network: "Pharos Testnet",
    risk: "baixo",
    score: 12,
    verdict: "Poucos sinais de atenção",
    summary: "Esta carteira tem um histórico consistente até aqui. Ainda assim, revise o valor e a permissão antes de assinar.",
    recommendationTitle: "Pode prosseguir",
    recommendation: "Não encontramos alertas críticos no histórico analisado. Confirme apenas se o site e o valor da transação são os esperados.",
    recommendationAction: "Prosseguir com revisão final",
    signals: [
      { label: "Idade do endereço", value: "214 dias", explanation: "O endereço já existe há tempo suficiente para termos contexto de comportamento.", evidence: "Primeira atividade há 214 dias", status: "clear", icon: Clock3 },
      { label: "Código verificado", value: "Verificado", explanation: "O código publicado pode ser comparado com o código que roda na rede.", evidence: "Verificação encontrada no explorador", status: "clear", icon: Code2 },
      { label: "Endereços sinalizados", value: "Nenhum", explanation: "Não vimos interação recente com endereços marcados por golpes ou sanções.", evidence: "0 correspondências em 2.408 interações", status: "clear", icon: Fingerprint },
      { label: "Padrão de aprovação", value: "Normal", explanation: "As permissões observadas estão dentro do comportamento esperado para este tipo de contrato.", evidence: "Sem aprovação ilimitada recente", status: "clear", icon: LockKeyhole },
      { label: "Movimentação recente", value: "Estável", explanation: "O fluxo de fundos não mostrou picos atípicos antes da consulta.", evidence: "Volume 7d dentro da faixa histórica", status: "clear", icon: Radar },
    ],
  },
  risky: {
    id: "risky",
    address: demoAddresses.risky,
    kind: "Contrato",
    network: "Pharos Testnet",
    risk: "alto",
    score: 86,
    verdict: "Interação não recomendada",
    summary: "Encontramos sinais combinados de risco. A origem e as permissões deste contrato precisam ser verificadas por outro canal.",
    recommendationTitle: "Evite assinar por enquanto",
    recommendation: "O conjunto de alertas é compatível com contratos recém-criados ou maliciosos. Não conecte sua carteira nem conceda aprovação até investigar a origem.",
    recommendationAction: "Evitar esta interação",
    signals: [
      { label: "Idade do contrato", value: "3 dias", explanation: "Contratos muito novos ainda não têm histórico suficiente para criar confiança.", evidence: "Primeira atividade há 3 dias", status: "danger", icon: Clock3 },
      { label: "Código verificado", value: "Não verificado", explanation: "Sem o código publicado, não dá para conferir com clareza o que a transação executa.", evidence: "Nenhum código-fonte verificado", status: "danger", icon: Code2 },
      { label: "Endereços sinalizados", value: "2 encontrados", explanation: "O contrato se relacionou com endereços que aparecem em listas de atenção.", evidence: "2 correspondências em 184 interações", status: "danger", icon: Fingerprint },
      { label: "Padrão de aprovação", value: "Incomum", explanation: "Foi detectada uma solicitação de aprovação ampla e recente, que pode permitir gastos futuros.", evidence: "Aprovação ilimitada há 18 min", status: "danger", icon: LockKeyhole },
      { label: "Movimentação recente", value: "Pico atípico", explanation: "O volume cresceu muito em pouco tempo, sem histórico que explique o salto.", evidence: "+920% de volume nas últimas 24h", status: "attention", icon: Radar },
    ],
  },
  mixed: {
    id: "mixed",
    address: "0x9c8F...D102",
    kind: "Carteira",
    network: "Pharos Testnet",
    risk: "médio",
    score: 48,
    verdict: "Revise com cautela",
    summary: "Há contexto suficiente para investigar, mas dois sinais merecem atenção antes de qualquer assinatura.",
    recommendationTitle: "Faça uma revisão extra",
    recommendation: "Confira a origem do contrato, reduza permissões quando possível e faça um teste com valor baixo antes de continuar.",
    recommendationAction: "Revisar antes de assinar",
    signals: [
      { label: "Idade do endereço", value: "26 dias", explanation: "O histórico ainda é curto para uma conclusão definitiva.", evidence: "Primeira atividade há 26 dias", status: "attention", icon: Clock3 },
      { label: "Código verificado", value: "Verificado", explanation: "O código pode ser comparado, mas isso não elimina todos os riscos.", evidence: "Verificação encontrada no explorador", status: "clear", icon: Code2 },
      { label: "Endereços sinalizados", value: "Nenhum", explanation: "Não há correspondências conhecidas nesta amostra.", evidence: "0 correspondências em 614 interações", status: "clear", icon: Fingerprint },
      { label: "Padrão de aprovação", value: "Revisar", explanation: "Uma permissão acima do padrão foi vista recentemente.", evidence: "Aprovação alta há 4h", status: "attention", icon: LockKeyhole },
      { label: "Movimentação recente", value: "Moderada", explanation: "O fluxo está acima da média, mas ainda não é conclusivo.", evidence: "+180% de volume nas últimas 24h", status: "attention", icon: Radar },
    ],
  },
};

const statusCopy: Record<SignalStatus, { label: string; className: string }> = {
  clear: { label: "OK", className: "signal-clear" },
  attention: { label: "ATENÇÃO", className: "signal-attention" },
  danger: { label: "ALERTA", className: "signal-danger" },
};

function shortenAddress(address: string) {
  if (address.length < 18) return address;
  return `${address.slice(0, 7)}...${address.slice(-6)}`;
}

function getResultForAddress(address: string): Result {
  const normalized = address.toLowerCase();
  if (normalized.includes("b4d9") || normalized.includes("99c2")) return results.risky;
  if (normalized.includes("71ca") || normalized.includes("a41e")) return results.clean;
  return results.mixed;
}

function RiskPill({ risk }: { risk: RiskLevel }) {
  return <span className={`risk-pill risk-${risk}`}>{risk === "baixo" ? "BAIXO" : risk === "médio" ? "MÉDIO" : "ALTO"}</span>;
}

function RiskScore({ result }: { result: Result }) {
  const tone = result.risk === "baixo" ? "score-safe" : result.risk === "médio" ? "score-mid" : "score-danger";
  return (
    <div className={`risk-score ${tone}`} aria-label={`Risco ${result.risk}, ${result.score} de 100`}>
      <div className="score-ring" style={{ "--score": `${result.score * 3.6}deg` } as CSSProperties}>
        <div className="score-ring-inner">
          <strong>{result.score}</strong>
          <span>/ 100</span>
        </div>
      </div>
      <div>
        <p className="eyebrow">NÍVEL DE RISCO</p>
        <div className="score-title"><RiskPill risk={result.risk} /></div>
        <p className="score-verdict">{result.verdict}</p>
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  const Icon = signal.icon;
  const status = statusCopy[signal.status];
  return (
    <article className="signal-card">
      <div className={`signal-icon ${status.className}`}><Icon size={17} strokeWidth={2.1} /></div>
      <div className="signal-main">
        <div className="signal-heading">
          <div>
            <p className="signal-label">{signal.label}</p>
            <strong>{signal.value}</strong>
          </div>
          <span className={`signal-status ${status.className}`}>
            {signal.status === "clear" ? <Check size={12} /> : signal.status === "danger" ? <X size={12} /> : <TriangleAlert size={12} />}
            {status.label}
          </span>
        </div>
        <p className="signal-explanation">{signal.explanation}</p>
        <div className="signal-evidence"><span></span>{signal.evidence}</div>
      </div>
    </article>
  );
}

export default function Home() {
  const [address, setAddress] = useState(demoAddresses.clean);
  const [selectedDemo, setSelectedDemo] = useState<"clean" | "risky">("clean");
  const [network, setNetwork] = useState("Pharos Testnet");
  const [result, setResult] = useState<Result>(results.clean);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  const signalCount = useMemo(() => result.signals.filter((signal) => signal.status !== "clear").length, [result]);

  const runScan = (nextAddress = address) => {
    if (!nextAddress.trim()) {
      toast.error("Cole uma carteira ou contrato para começar.");
      return;
    }
    setChecking(true);
    setTimeout(() => {
      setResult({ ...getResultForAddress(nextAddress), network });
      setChecking(false);
      toast.success("Análise concluída", { description: "Os sinais da demonstração foram atualizados." });
    }, 720);
  };

  const loadDemo = (demo: "clean" | "risky") => {
    setSelectedDemo(demo);
    setAddress(demoAddresses[demo]);
    runScan(demoAddresses[demo]);
  };

  const copyReport = async () => {
    const report = `RiskGuard — relatório de demonstração\nEndereço: ${result.address}\nRede: ${result.network}\nRisco: ${result.risk.toUpperCase()} (${result.score}/100)\nVeredito: ${result.verdict}\nRecomendação: ${result.recommendation}\nSinais de atenção: ${signalCount} de 5`;
    const evidence = result.signals.map((signal) => `- ${signal.label}: ${signal.value} — ${signal.evidence}. ${signal.explanation}`).join("\n");
    const completeReport = `${report}\n\nEvidências:\n${evidence}`;
    try {
      await navigator.clipboard.writeText(completeReport);
      setCopied(true);
      toast.success("Relatório copiado", { description: "Cole o resumo onde quiser compartilhar." });
      setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Não foi possível copiar automaticamente", { description: "Selecione e copie o resumo manualmente." });
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="RiskGuard início">
          <span className="brand-mark"><span></span><span></span><span></span></span>
          <span className="brand-name">riskguard</span>
          <span className="brand-beta">BETA</span>
        </a>
        <nav className="topnav" aria-label="Navegação principal">
          <a href="#como-funciona">Como funciona</a>
          <a href="#sinais">Os 5 sinais</a>
          <span className="network-status"><span className="live-dot"></span> sistema online</span>
        </nav>
      </header>

      <main id="top">
        <section className="hero container">
          <div className="hero-copy">
            <div className="kicker"><span className="kicker-line"></span> FILTRO DE SEGURANÇA PRÉ-TRANSAÇÃO</div>
            <h1>Veja os sinais<br /><em>antes de assinar.</em></h1>
            <p className="hero-lede">O RiskGuard lê o histórico de uma carteira ou contrato e traduz os sinais on-chain em uma decisão simples: prosseguir, revisar ou evitar.</p>
            <div className="hero-proof">
              <div><strong>05</strong><span>sinais<br />analisados</span></div>
              <div><strong>03</strong><span>níveis de<br />risco</span></div>
              <div><strong>01</strong><span>decisão<br />mais segura</span></div>
            </div>
            <div className="hero-note"><Sparkles size={15} /> Dados de demonstração para explorar o produto sem conectar sua carteira.</div>
          </div>

          <div className="scanner-wrap">
            <div className="scanner-rail">PRÉ<br />TRANS<br />AÇÃO</div>
            <div className="scanner-card">
              <div className="scanner-topline"><div><span className="tiny-dot"></span> SCANNER 01</div><span className="scanner-time">última atualização agora</span></div>
              <div className="scanner-title-row">
                <div><p className="eyebrow">CONSULTAR ENDEREÇO</p><h2>Qual carteira você quer conferir?</h2></div>
                <div className="scan-icon"><Radar size={22} /></div>
              </div>
              <label className="field-label" htmlFor="wallet-address">Carteira ou contrato</label>
              <div className="address-input-wrap">
                <WalletCards size={17} />
                <input id="wallet-address" value={address} onChange={(event) => setAddress(event.target.value)} onKeyDown={(event) => event.key === "Enter" && runScan()} placeholder="0x..." spellCheck={false} />
                {address && <button className="clear-input" onClick={() => setAddress("")} aria-label="Limpar endereço"><X size={15} /></button>}
              </div>
              <div className="field-row">
                <div className="select-wrap"><span className="field-label">Rede</span><select value={network} onChange={(event) => setNetwork(event.target.value)}><option>Pharos Testnet</option><option>Ethereum</option><option>Base</option></select></div>
                <div className="address-type"><span className="field-label">Tipo detectado</span><strong>{result.kind}</strong></div>
              </div>
              <button className="scan-button" onClick={() => runScan()} disabled={checking}>
                {checking ? <><Loader2 size={17} className="spin" /> lendo histórico...</> : <><Radar size={17} /> verificar agora <ArrowUpRight size={16} /></>}
              </button>
              <div className="scanner-lock"><LockKeyhole size={13} /> somente leitura · nenhuma transação será assinada</div>
            </div>
          </div>
        </section>

        <section className="demo-strip container" aria-label="Exemplos de demonstração">
          <div className="demo-intro"><span className="eyebrow">COMECE POR UM EXEMPLO</span><p>Veja como o mesmo filtro reage a históricos diferentes.</p></div>
          <button className={`demo-card ${selectedDemo === "clean" ? "active" : ""}`} onClick={() => loadDemo("clean")}>
            <span className="demo-icon demo-safe"><ShieldCheck size={18} /></span><span><small>EXEMPLO 01 · LIMPO</small><strong>Carteira consistente</strong><em>{shortenAddress(demoAddresses.clean)}</em></span><RiskPill risk="baixo" /><ArrowUpRight size={16} />
          </button>
          <button className={`demo-card ${selectedDemo === "risky" ? "active" : ""}`} onClick={() => loadDemo("risky")}>
            <span className="demo-icon demo-danger"><ShieldAlert size={18} /></span><span><small>EXEMPLO 02 · ATENÇÃO</small><strong>Contrato suspeito</strong><em>{shortenAddress(demoAddresses.risky)}</em></span><RiskPill risk="alto" /><ArrowUpRight size={16} />
          </button>
        </section>

        <section className="results-section container" id="como-funciona">
          <div className="section-heading">
            <div><span className="eyebrow">RESULTADO DA LEITURA</span><h2>Contexto para decidir melhor.</h2></div>
            <div className="heading-actions"><span className="demo-badge"><span></span> análise de demonstração</span><button className="share-button" onClick={copyReport}>{copied ? <ClipboardCheck size={16} /> : <Copy size={16} />}{copied ? "copiado" : "copiar relatório"}</button></div>
          </div>

          <div className="result-overview">
            <RiskScore result={result} />
            <div className="overview-detail"><div className="overview-address"><div className="address-token"><WalletCards size={18} /></div><div><span className="eyebrow">{result.kind.toUpperCase()} · {result.network.toUpperCase()}</span><strong>{shortenAddress(result.address)}</strong></div><button className="icon-button" aria-label="Copiar endereço" onClick={() => navigator.clipboard?.writeText(result.address)}><Clipboard size={15} /></button></div><p>{result.summary}</p><div className="overview-meta"><span><CheckCircle2 size={15} /> leitura concluída em 0,7s</span><span><Info size={15} /> resultado não assina transações</span></div></div>
            <div className={`signal-count signal-count-${result.risk}`}><span className="eyebrow">SINAIS DE ATENÇÃO</span><strong>{signalCount}<small>/05</small></strong><span>{signalCount === 0 ? "nenhum alerta crítico" : signalCount === 1 ? "ponto para revisar" : "pontos para revisar"}</span></div>
          </div>

          <div className="signals-head" id="sinais"><div><span className="eyebrow">EVIDÊNCIAS DO HISTÓRICO</span><h3>O que encontramos</h3></div><span className="signals-caption">Cada bandeira vem com o motivo em linguagem simples.</span></div>
          <div className="signals-grid">{result.signals.map((signal) => <SignalCard key={signal.label} signal={signal} />)}</div>

          <div className={`recommendation recommendation-${result.risk}`}>
            <div className="recommendation-mark">{result.risk === "alto" ? <ShieldAlert size={24} /> : result.risk === "médio" ? <TriangleAlert size={24} /> : <ShieldCheck size={24} />}</div>
            <div className="recommendation-copy"><span className="eyebrow">RECOMENDAÇÃO DO RISKGUARD</span><h3>{result.recommendationTitle}</h3><p>{result.recommendation}</p></div>
            <button className="recommendation-action" onClick={copyReport}>{result.recommendationAction}<ArrowUpRight size={16} /></button>
          </div>
        </section>

        <section className="how-section container">
          <div className="how-card"><div className="how-number">01</div><div><span className="eyebrow">VOCÊ COLA O ENDEREÇO</span><h3>Sem conectar a carteira.</h3><p>O filtro começa em modo somente leitura e não pede assinatura, senha ou permissão.</p></div></div>
          <div className="how-card"><div className="how-number">02</div><div><span className="eyebrow">A GENTE ORGANIZA OS SINAIS</span><h3>Dados difíceis viram contexto.</h3><p>Idade, código, aprovações e movimentações aparecem lado a lado, com evidência.</p></div></div>
          <div className="how-card"><div className="how-number">03</div><div><span className="eyebrow">VOCÊ DECIDE COM MAIS CLAREZA</span><h3>Uma próxima ação simples.</h3><p>Prossiga, revise ou evite. O RiskGuard não decide por você — ele mostra o que importa.</p></div></div>
        </section>
      </main>

      <footer className="footer container"><div className="brand footer-brand"><span className="brand-mark"><span></span><span></span><span></span></span><span className="brand-name">riskguard</span></div><span>Filtro de segurança pré-transação · construído para Pharos</span><span className="footer-right">v0.1 demo <ExternalLink size={13} /></span></footer>
    </div>
  );
}
