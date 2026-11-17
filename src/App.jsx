import { useEffect, useRef, useState } from 'react'
import {
  Braces, Building2, CalendarDays, CreditCard, Fingerprint,
  MapPin, Moon, RefreshCw, ShieldCheck, Smartphone, Sun,
} from 'lucide-react'
import GeneratorCard from '@/components/GeneratorCard'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  BRAZIL_DDDS_BY_UF, CARD_BRANDS, CEP_REGIONS, CPF_REGIONS, DATE_PRESETS,
  formatCEP, formatCNPJ, formatCPF, formatCreditCard, formatDate, formatPhone, formatRG,
  generateCEP, generateCNPJ, generateCPF, generateCreditCard, generateDate,
  generatePhone, generateRG,
} from '@/utils/generators'

const UFS = Object.keys(BRAZIL_DDDS_BY_UF).sort()

function Choice({ label, value, onChange, items }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size="sm" aria-label={label} className="option-select"
        title={items.find((item) => item.code === value)?.label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map(({ code, label: itemLabel }) => (
          <SelectItem key={code} value={code}>{itemLabel}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ToggleOption({ id, label, checked, onChange }) {
  return (
    <div className="toggle-option">
      <Label htmlFor={id}>{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

const GENERATORS = [
  {
    id: 'cpf', title: 'CPF', description: 'Pessoa física', icon: Fingerprint,
    generator: generateCPF, formatter: formatCPF, initialOptions: { region: 'any' },
    optionsComponent: ({ options: state, onChange: update }) => (
      <Choice label="Região fiscal do CPF" value={state.region}
        onChange={(region) => update({ ...state, region })} items={CPF_REGIONS} />
    ),
  },
  {
    id: 'cnpj', title: 'CNPJ', description: 'Pessoa jurídica', icon: Building2,
    generator: generateCNPJ, formatter: formatCNPJ,
    initialOptions: { alphanumeric: false, branchMode: '0001' },
    optionsComponent: ({ options: state, onChange: update }) => (
      <div className="option-pair cnpj-options">
        <Choice label="Ordem/filial do CNPJ" value={state.branchMode}
          onChange={(branchMode) => update({ ...state, branchMode })}
          items={[{ code: '0001', label: 'Matriz (0001)' }, { code: 'random', label: 'Filial aleatória' }]} />
        <ToggleOption id="cnpj-alnum" label="Alfanumérico" checked={state.alphanumeric}
          onChange={(alphanumeric) => update({ ...state, alphanumeric })} />
      </div>
    ),
  },
  {
    id: 'rg', title: 'RG', description: 'Padrão SSP-SP', icon: ShieldCheck,
    generator: generateRG, formatter: formatRG, initialOptions: { allowX: true },
    optionsComponent: ({ options: state, onChange: update }) => (
      <ToggleOption id="rg-allow-x" label='Permitir dígito "X"' checked={state.allowX}
        onChange={(allowX) => update({ ...state, allowX })} />
    ),
  },
  {
    id: 'cep', title: 'CEP', description: 'Código postal', icon: MapPin,
    generator: generateCEP, formatter: formatCEP, initialOptions: { region: 'any' },
    optionsComponent: ({ options: state, onChange: update }) => (
      <Choice label="Região postal do CEP" value={state.region}
        onChange={(region) => update({ ...state, region })} items={CEP_REGIONS} />
    ),
  },
  {
    id: 'card', title: 'Cartão', description: 'Número com Luhn', icon: CreditCard,
    generator: generateCreditCard, formatter: formatCreditCard, initialOptions: { brand: 'any' },
    optionsComponent: ({ options: state, onChange: update }) => (
      <Choice label="Bandeira do cartão" value={state.brand}
        onChange={(brand) => update({ ...state, brand })} items={CARD_BRANDS} />
    ),
  },
  {
    id: 'date', title: 'Data', description: 'Datas e períodos', icon: CalendarDays,
    generator: generateDate, formatter: formatDate, initialOptions: { preset: 'any' },
    optionsComponent: ({ options: state, onChange: update }) => (
      <Choice label="Período da data" value={state.preset}
        onChange={(preset) => update({ ...state, preset })} items={DATE_PRESETS} />
    ),
  },
  {
    id: 'phone', title: 'Telefone', description: 'Fixo e celular', icon: Smartphone,
    generator: generatePhone, formatter: formatPhone, initialOptions: { type: 'any', uf: 'any' },
    optionsComponent: ({ options: state, onChange: update }) => (
      <div className="option-pair">
        <Choice label="Tipo de telefone" value={state.type}
          onChange={(type) => update({ ...state, type })}
          items={[{ code: 'any', label: 'Qualquer tipo' }, { code: 'mobile', label: 'Celular' }, { code: 'landline', label: 'Fixo' }]} />
        <Choice label="Estado do DDD" value={state.uf}
          onChange={(uf) => update({ ...state, uf })}
          items={[{ code: 'any', label: 'Todos os DDDs' }, ...UFS.map((uf) => ({
            code: uf, label: `${uf} (${BRAZIL_DDDS_BY_UF[uf].join(', ')})`,
          }))]} />
      </div>
    ),
  },
]

function App() {
  const [activeGenerator, setActiveGenerator] = useState('cpf')
  const generatorRefs = useRef({})
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('theme')
      return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    try {
      localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    } catch {
      // The theme still works when browser storage is unavailable.
    }
  }, [darkMode])

  const generateAll = () => {
    Object.values(generatorRefs.current).forEach((generator) => generator?.generate())
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <a className="brand" href="./" aria-label="Brazilian Mock Data, início">
            <span className="brand-mark"><Braces aria-hidden="true" /></span>
            <span>Brazilian <strong>Mock Data</strong></span>
          </a>
          <div className="header-actions">
            <span className="local-badge"><span />100% local</span>
            <span className="header-divider" />
            <Button type="button" variant="ghost" size="icon" className="theme-button"
              onClick={() => setDarkMode((previous) => !previous)}
              aria-label={darkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}
              title={darkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}>
              {darkMode ? <Sun /> : <Moon />}
            </Button>
          </div>
        </div>
      </header>

      <main className="workspace">
        <div className="workspace-heading">
          <div>
            <h1>Dados de teste, sem complicação.</h1>
            <p>Escolha, gere e copie. O resto fica com a gente.</p>
          </div>
          <Button type="button" className="generate-all" onClick={generateAll}>
            <RefreshCw aria-hidden="true" />Gerar todos
          </Button>
        </div>

        <nav className="generator-nav" aria-label="Selecionar gerador">
          {GENERATORS.map((item) => {
            const { id, title, icon: Icon } = item
            return (
              <button key={id} type="button" className="generator-tab"
                aria-pressed={activeGenerator === id}
                aria-controls={`generator-${id}`}
                onClick={() => setActiveGenerator(id)}>
                <Icon aria-hidden="true" /><span>{title}</span>
              </button>
            )
          })}
        </nav>

        <section className="generator-panel" aria-label="Geradores de dados brasileiros">
          <div className="column-headings" aria-hidden="true">
            <span>Gerador</span><span>Configurações</span><span>Resultado</span>
            <span className="format-heading">Máscara</span><span className="actions-heading">Ações</span>
          </div>
          {GENERATORS.map((item) => (
            <GeneratorCard key={item.id} {...item} active={activeGenerator === item.id}
              ref={(handle) => { generatorRefs.current[item.id] = handle }} />
          ))}
        </section>

        <footer className="workspace-footer">
          <span><ShieldCheck aria-hidden="true" />Seus dados não saem deste navegador.</span>
          <span>Dados fictícios. Apenas para desenvolvimento e testes.</span>
        </footer>
      </main>
    </div>
  )
}

export default App
