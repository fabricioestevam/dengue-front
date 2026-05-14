import { useState, useEffect, useCallback } from "react";

const API_BASE = "http://localhost:8000/api/v1";

const CORES = {
  primary: "#0057B8",
  primaryHover: "#004799",
  secondary: "#00AEEF",

  success: "#1D9E75",
  warning: "#BA7517",
  danger: "#A32D2D",

  bg: "#F7F9FC",
  surface: "#FFFFFF",

  text: "#101828",
  textSoft: "#667085",

  border: "#E4E7EC",
};

const RISCO = (casos) => {
  if (casos < 50)
    return {
      label: "baixo",
      color: CORES.success,
      bg: "#E8F7F1",
      border: "#B7E4D3",
    };

  if (casos < 120)
    return {
      label: "moderado",
      color: CORES.warning,
      bg: "#FFF4E5",
      border: "#F6D7A8",
    };

  if (casos < 200)
    return {
      label: "alto",
      color: "#B54708",
      bg: "#FFF1E8",
      border: "#F7C6A8",
    };

  return {
    label: "crítico",
    color: CORES.danger,
    bg: "#FDECEC",
    border: "#F6C7C7",
  };
};

const SE_ATUAL = Math.ceil(
  (new Date() - new Date(new Date().getFullYear(), 0, 1)) /
  (7 * 86400000)
);

function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          border: `2px solid ${CORES.border}`,
          borderTop: `2px solid ${CORES.primary}`,
          borderRadius: "50%",
          animation: "spin .8s linear infinite",
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

function Badge({ risco }) {
  const r = RISCO(risco);

  return (
    <span
      style={{
        background: r.bg,
        color: r.color,
        border: `1px solid ${r.border}`,
        borderRadius: 999,
        padding: "4px 10px",
        fontSize: 11,
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: r.color,
        }}
      />

      {r.label}
    </span>
  );
}

function KpiCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: CORES.surface,
        border: `1px solid ${CORES.border}`,
        borderRadius: 8,
        padding: "18px",
        position: "relative",
        boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          background: accent,
        }}
      />

      <div
        style={{
          fontSize: 11,
          color: CORES.textSoft,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color: CORES.text,
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        {value}
      </div>

      <div
        style={{
          fontSize: 13,
          color: CORES.textSoft,
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function PainelHistorico({ historico, loading }) {
  console.log("DADOS DA API:", historico);
  if (loading) return <Spinner />;

  if (!historico.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "2rem",
          color: CORES.textSoft,
          fontSize: 14,
        }}
      >
        Nenhum dado encontrado.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: `1px solid ${CORES.border}`,
              background: "#F9FAFB",
            }}
          >
            {[
              "Ano",
              "SE",
              "Casos",
              "Temp",
              "Chuva",
              "Umidade",
              "Risco",
            ].map((h) => (
              <th
                key={h}
                style={{
                  padding: "14px 16px",
                  textAlign: "left",
                  fontSize: 11,
                  color: CORES.textSoft,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {historico.map((row, i) => {
            if (!row) return null;

            return (
              <tr
                key={i}
                style={{
                  borderBottom: `1px solid ${CORES.border}`,
                }}
              >
                {/* 1. Coluna do Ano */}
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: 600,
                    color: CORES.text,
                  }}
                >
                  {row.ANO}
                </td>

                {/* 2. Coluna da Semana */}
                <td
                  style={{
                    padding: "14px 16px",
                    color: CORES.textSoft,
                  }}
                >
                  {String(row.SEMANA || 0).padStart(2, "0")}
                </td>

                {/* 3. Coluna de Casos */}
                <td
                  style={{
                    padding: "14px 16px",
                    fontWeight: 700,
                    color: CORES.text,
                  }}
                >
                  {row.CASOS?.toLocaleString("pt-BR") || "0"}
                </td>

                {/* 4. Coluna de Temperatura */}
                <td
                  style={{
                    padding: "14px 16px",
                    color: CORES.textSoft,
                  }}
                >
                  {row.TEMP_MEDIA_C?.toFixed(1) || "—"}°C
                </td>

                {/* 5. Coluna de Precipitação */}
                <td
                  style={{
                    padding: "14px 16px",
                    color: CORES.textSoft,
                  }}
                >
                  {row.PRECIPITACAO_MM?.toFixed(1) || "—"}mm
                </td>

                {/* 6. COLUNA DA UMIDADE (A QUE ESTAVA FALTANDO) */}
                <td
                  style={{
                    padding: "14px 16px",
                    color: CORES.textSoft,
                  }}
                >
                  {Math.round(row.UMIDADE_MEDIA || row.UMIDADE || 0)}%
                </td>

                {/* 7. Coluna do Badge de Risco */}
                <td style={{ padding: "14px 16px" }}>
                  <Badge risco={row.CASOS || 0} />
                </td>


              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}

function FormularioPredicao({ onPredicao }) {
  const [form, setForm] = useState({
    precipitacao_mm: "",
    temp_media_c: "",
    umidade_media: "",
    ano: new Date().getFullYear(),
    semana: SE_ATUAL + 4,
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handle = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.value,
    }));

  const submit = async () => {
    setLoading(true);
    setErro(null);

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          precipitacao_mm: parseFloat(form.precipitacao_mm || form.PRECIPITACAO_MM || 10.5),
          temp_media_c: parseFloat(form.temp_media_c || form.TEMP_MEDIA_C || 25.8),
          umidade_media: parseFloat(form.umidade_media || form.UMIDADE_MEDIA || 81.0),
          ano: parseInt(form.ano || form.ANO || new Date().getFullYear()),
          semana: parseInt(form.semana || form.SEMANA || 23),
        }),


      });

      if (!res.ok) {
        throw new Error("Erro ao gerar previsão");
      }


      if (!res.ok) {
        throw new Error("Erro ao gerar previsão");
      }

      const data = await res.json();
      onPredicao(data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 8,
    border: `1px solid ${CORES.border}`,
    background: CORES.surface,
    color: CORES.text,
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: '"IBM Plex Mono", monospace',
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 18,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 600,
              color: CORES.text,
            }}
          >
            Temperatura média
          </label>

          <input
            style={inputStyle}
            type="number"
            value={form.temp_media_c}
            onChange={handle("temp_media_c")}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 600,
              color: CORES.text,
            }}
          >
            Precipitação
          </label>

          <input
            style={inputStyle}
            type="number"
            value={form.precipitacao_mm}
            onChange={handle("precipitacao_mm")}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 600,
              color: CORES.text,
            }}
          >
            Umidade relativa
          </label>

          <input
            style={inputStyle}
            type="number"
            value={form.umidade_media}
            onChange={handle("umidade_media")}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 600,
              color: CORES.text,
            }}
          >
            Semana epidemiológica
          </label>

          <input
            style={inputStyle}
            type="number"
            value={form.semana}
            onChange={handle("semana")}
          />
        </div>
      </div>

      {erro && (
        <div
          style={{
            marginBottom: 14,
            padding: "12px 14px",
            borderRadius: 8,
            background: "#FDECEC",
            color: CORES.danger,
            border: "1px solid #F6C7C7",
            fontSize: 13,
          }}
        >
          {erro}
        </div>
      )}

      <button
        onClick={submit}
        disabled={loading}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 8,
          border: "none",
          background: loading ? "#BFC7D4" : CORES.primary,
          color: "white",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          transition: ".2s",
          fontFamily: '"IBM Plex Mono", monospace',
        }}
      >
        {loading ? "Gerando previsão..." : "Gerar previsão"}
      </button>
    </div>
  );
}

function ResultadoPredicao({ resultado }) {
  const r = RISCO(resultado.casos_preditos);

  return (
    <div
      style={{
        background: r.bg,
        border: `1px solid ${r.border}`,
        borderRadius: 8,
        padding: "24px",
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: r.color,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        Resultado da previsão
      </div>

      <div
        style={{
          fontSize: 52,
          fontWeight: 700,
          color: r.color,
          lineHeight: 1,
          marginBottom: 10,
        }}
      >
        {Math.round(resultado.casos_preditos)}
      </div>

      <div
        style={{
          fontSize: 15,
          color: CORES.textSoft,
          marginBottom: 18,
        }}
      >
        casos previstos para SE {resultado.semana}/{resultado.ano}
      </div>

      <Badge risco={resultado.casos_preditos} />
    </div>
  );
}

export default function App() {
  const [aba, setAba] = useState("dashboard");

  const [historico, setHistorico] = useState([]);
  const [predicoes, setPredicoes] = useState([]);

  const [loadingHistorico, setLoadingHistorico] =
    useState(false);

  const [resultado, setResultado] = useState(null);

  const [apiStatus, setApiStatus] =
    useState("verificando");

  const verificarApi = useCallback(async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/health"
      );

      setApiStatus(res.ok ? "online" : "offline");
    } catch {
      setApiStatus("offline");
    }
  }, []);

  const carregarHistorico = useCallback(async () => {
    setLoadingHistorico(true);

    try {
      const res = await fetch(
        `${API_BASE}/historico?limite=200`
      );

      if (res.ok) {
        setHistorico(await res.json());
      }
    } catch { }

    setLoadingHistorico(false);
  }, []);

  const carregarPredicoes = useCallback(async () => {
    try {
      const res = await fetch(
        `${API_BASE}/predicoes?limite=50`
      );

      if (res.ok) {
        setPredicoes(await res.json());
      }
    } catch { }
  }, []);

  useEffect(() => {
    verificarApi();
    carregarHistorico();
    carregarPredicoes();
  }, []);

  const totalCasos = historico.reduce(
    (a, h) => a + (h?.CASOS || 0),
    0
  );

  const pico = historico.length
    ? historico.reduce((a, h) =>
      (h?.CASOS || 0) > (a?.CASOS || 0) ? h : a
    )
    : null;

  const abas = [
    {
      id: "dashboard",
      label: "Monitoramento",
    },

    {
      id: "previsao",
      label: "Nova previsão",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: CORES.bg,
        padding: "24px",
        fontFamily: '"IBM Plex Mono", monospace',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: CORES.surface,
            border: `1px solid ${CORES.border}`,
            borderRadius: 8,
            overflow: "hidden",
            marginBottom: 24,
            boxShadow:
              "0 1px 2px rgba(16,24,40,0.04)",
          }}
        >
          <div
            style={{
              height: 5,
              background: CORES.primary,
            }}
          />

          <div
            style={{
              padding: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  color: CORES.primary,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                Plataforma Integrada
              </div>

              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: CORES.text,
                  marginBottom: 8,
                  lineHeight: 1.1,
                }}
              >
                Análise Preditiva de Casos de Dengue
              </div>

              <div
                style={{
                  color: CORES.textSoft,
                  fontSize: 14,
                }}
              >
                Monitoramento climático e previsão epidemiológica
              </div>
            </div>

            <div
              style={{
                background:
                  apiStatus === "online"
                    ? "#E8F7F1"
                    : "#FDECEC",

                color:
                  apiStatus === "online"
                    ? CORES.success
                    : CORES.danger,

                border: `1px solid ${apiStatus === "online"
                  ? "#B7E4D3"
                  : "#F6C7C7"
                  }`,

                borderRadius: 999,
                padding: "8px 14px",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              API {apiStatus}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <KpiCard
            label="Registros"
            value={historico.length}
            sub="semanas monitoradas"
            accent={CORES.primary}
          />

          <KpiCard
            label="Casos acumulados"
            value={totalCasos.toLocaleString("pt-BR")}
            sub="base histórica"
            accent={CORES.danger}
          />

          <KpiCard
            label="Pico histórico"
            value={pico?.CASOS?.toLocaleString("pt-BR") || 0}
            sub={
              pico
                ? `SE ${String(pico.SEMANA).padStart(2, "0")}/${pico.ANO}`
                : "sem dados"
            }
            accent={CORES.warning}
          />


          <KpiCard
            label="Previsões"
            value={predicoes.length}
            sub="predições registradas"
            accent={CORES.secondary}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 4,
            background: "#F3F6FA",
            padding: 4,
            borderRadius: 12,
            width: "fit-content",
            marginBottom: 24,
          }}
        >
          {abas.map((a) => (
            <button
              key={a.id}
              onClick={() => setAba(a.id)}
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: 8,
                background:
                  aba === a.id
                    ? "#FFFFFF"
                    : "transparent",

                boxShadow:
                  aba === a.id
                    ? "0 1px 3px rgba(0,0,0,0.08)"
                    : "none",

                color:
                  aba === a.id
                    ? CORES.primary
                    : CORES.textSoft,

                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: '"IBM Plex Mono", monospace',
              }}
            >
              {a.label}
            </button>
          ))}
        </div>

        {aba === "dashboard" && (
          <div
            style={{
              background: CORES.surface,
              border: `1px solid ${CORES.border}`,
              borderRadius: 8,
              overflow: "hidden",
              boxShadow:
                "0 1px 2px rgba(16,24,40,0.04)",
            }}
          >
            <div
              style={{
                height: 4,
                background: CORES.primary,
              }}
            />

            <div
              style={{
                padding: "18px 20px",
                borderBottom: `1px solid ${CORES.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: CORES.text,
                  marginBottom: 4,
                }}
              >
                Histórico epidemiológico
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: CORES.textSoft,
                }}
              >
                Dados históricos integrados ao sistema
              </div>
            </div>

            <PainelHistorico
              historico={historico}
              loading={loadingHistorico}
            />
          </div>
        )}

        {aba === "previsao" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div
              style={{
                background: CORES.surface,
                border: `1px solid ${CORES.border}`,
                borderRadius: 8,
                overflow: "hidden",
                boxShadow:
                  "0 1px 2px rgba(16,24,40,0.04)",
              }}
            >
              <div
                style={{
                  height: 4,
                  background: CORES.primary,
                }}
              />

              <div style={{ padding: 20 }}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 8,
                    color: CORES.text,
                  }}
                >
                  Nova previsão
                </div>

                <div
                  style={{
                    fontSize: 14,
                    color: CORES.textSoft,
                    marginBottom: 20,
                    lineHeight: 1.6,
                  }}
                >
                  Informe os dados climáticos atuais para gerar uma nova previsão epidemiológica.
                </div>

                <FormularioPredicao
                  onPredicao={(data) => {
                    setResultado(data);
                    carregarPredicoes();
                  }}
                />
              </div>
            </div>

            <div>
              {resultado ? (
                <ResultadoPredicao
                  resultado={resultado}
                />
              ) : (
                <div
                  style={{
                    background: CORES.surface,
                    border: `1px solid ${CORES.border}`,
                    borderRadius: 8,
                    padding: "32px",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    boxSizing: "border-box",
                    color: CORES.textSoft,
                    lineHeight: 1.7,
                  }}
                >
                  Preencha os dados climáticos para visualizar a previsão epidemiológica.
                </div>
              )}
            </div>
          </div>
        )}

        <div
          style={{
            marginTop: 28,
            paddingTop: 18,
            borderTop: `1px solid ${CORES.border}`,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: CORES.textSoft,
            }}
          >
            Ridge Regression • INMET + SINAN
          </div>

          <div
            style={{
              fontSize: 12,
              color: CORES.textSoft
            }}
          >
            Plataforma integrada de monitoramento epidemiológico
          </div>
        </div>
      </div>
    </div>
  );
}