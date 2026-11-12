import React, { useEffect, useState } from 'react'
import { Braces, Moon, Sun } from 'lucide-react'
import GeneratorCard from '@/components/GeneratorCard'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  BRAZIL_DDDS_BY_UF,
  CARD_BRANDS,
  CEP_REGIONS,
  CPF_REGIONS,
  DATE_PRESETS,
  formatCEP,
  formatCNPJ,
  formatCPF,
  formatCreditCard,
  formatDate,
  formatPhone,
  formatRG,
  generateCEP,
  generateCNPJ,
  generateCPF,
  generateCreditCard,
  generateDate,
  generatePhone,
  generateRG,
} from '@/utils/generators'

const UFS = Object.keys(BRAZIL_DDDS_BY_UF).sort()

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', darkMode)
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <div className="min-h-dvh flex flex-col bg-background text-foreground">
      <header className="border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Braces className="size-3.5" />
            </div>
            <h1 className="text-sm font-semibold tracking-tight whitespace-nowrap">
              Brazilian Mock Data
            </h1>
            <span className="hidden truncate text-xs text-muted-foreground md:inline">
              — Gere documentos e dados brasileiros válidos para testes
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label={darkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={darkMode ? 'Tema claro' : 'Tema escuro'}
          >
            {darkMode ? <Sun /> : <Moon />}
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-4 sm:px-6">
        <section className="grid w-full grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <GeneratorCard
            title="CPF"
            description="Módulo 11 sem dígitos repetidos"
            generator={generateCPF}
            formatter={formatCPF}
            initialOptions={{ region: 'any' }}
            optionsComponent={(state, setState) => (
              <Select
                value={state.region || 'any'}
                onValueChange={(value) => setState({ ...state, region: value })}
              >
                <SelectTrigger size="sm" aria-label="Região fiscal do CPF">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CPF_REGIONS.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <GeneratorCard
            title="CNPJ"
            description="Numérico ou alfanumérico (RFB)"
            generator={generateCNPJ}
            formatter={formatCNPJ}
            initialOptions={{ alphanumeric: false, branchMode: '0001' }}
            optionsComponent={(state, setState) => (
              <div className="flex items-center gap-2">
                <Select
                  value={state.branchMode || '0001'}
                  onValueChange={(value) =>
                    setState({ ...state, branchMode: value })
                  }
                >
                  <SelectTrigger size="sm" aria-label="Ordem/filial do CNPJ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0001">Matriz (0001)</SelectItem>
                    <SelectItem value="random">Filial aleatória</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex shrink-0 items-center gap-1.5 rounded-md border px-2 h-8">
                  <Label
                    htmlFor="cnpj-alnum"
                    className="text-[11px] text-muted-foreground cursor-pointer whitespace-nowrap"
                  >
                    Alfanum
                  </Label>
                  <Switch
                    id="cnpj-alnum"
                    checked={Boolean(state.alphanumeric)}
                    onCheckedChange={(checked) =>
                      setState({ ...state, alphanumeric: checked })
                    }
                  />
                </div>
              </div>
            )}
          />

          <GeneratorCard
            title="RG"
            description="Padrão SSP-SP (Módulo 11)"
            generator={generateRG}
            formatter={formatRG}
            initialOptions={{ allowX: true }}
            optionsComponent={(state, setState) => (
              <div className="flex h-8 items-center justify-between rounded-md border px-2.5">
                <Label
                  htmlFor="rg-allow-x"
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  Permitir dígito &quot;X&quot;
                </Label>
                <Switch
                  id="rg-allow-x"
                  checked={state.allowX ?? true}
                  onCheckedChange={(checked) =>
                    setState({ ...state, allowX: checked })
                  }
                />
              </div>
            )}
          />

          <GeneratorCard
            title="CEP"
            description="Faixas postais dos Correios"
            generator={generateCEP}
            formatter={formatCEP}
            initialOptions={{ region: 'any' }}
            optionsComponent={(state, setState) => (
              <Select
                value={state.region || 'any'}
                onValueChange={(value) => setState({ ...state, region: value })}
              >
                <SelectTrigger size="sm" aria-label="Região postal do CEP">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CEP_REGIONS.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <GeneratorCard
            title="Cartão de Crédito"
            description="Prefixos reais com Luhn"
            generator={generateCreditCard}
            formatter={formatCreditCard}
            initialOptions={{ brand: 'any' }}
            optionsComponent={(state, setState) => (
              <Select
                value={state.brand || 'any'}
                onValueChange={(value) => setState({ ...state, brand: value })}
              >
                <SelectTrigger size="sm" aria-label="Bandeira do cartão">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CARD_BRANDS.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <GeneratorCard
            title="Data"
            description="DD/MM/AAAA ou AAAA-MM-DD"
            generator={generateDate}
            formatter={formatDate}
            initialOptions={{ preset: 'any' }}
            optionsComponent={(state, setState) => (
              <Select
                value={state.preset || 'any'}
                onValueChange={(value) => setState({ ...state, preset: value })}
              >
                <SelectTrigger size="sm" aria-label="Período da data">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_PRESETS.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />

          <GeneratorCard
            title="Telefone"
            description="67 DDDs oficiais da Anatel"
            generator={generatePhone}
            formatter={formatPhone}
            className="sm:col-span-2"
            initialOptions={{ type: 'any', uf: 'any' }}
            optionsComponent={(state, setState) => (
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <RadioGroup
                  value={state.type || 'any'}
                  onValueChange={(value) => setState({ ...state, type: value })}
                  className="flex flex-wrap items-center gap-4"
                  aria-label="Tipo de telefone"
                >
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="any" id="phone-any" />
                    <Label htmlFor="phone-any" className="cursor-pointer text-xs font-normal">
                      Qualquer
                    </Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="mobile" id="phone-mobile" />
                    <Label htmlFor="phone-mobile" className="cursor-pointer text-xs font-normal">
                      Celular
                    </Label>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value="landline" id="phone-landline" />
                    <Label htmlFor="phone-landline" className="cursor-pointer text-xs font-normal">
                      Fixo
                    </Label>
                  </div>
                </RadioGroup>

                <div className="sm:w-56">
                  <Select
                    value={state.uf || 'any'}
                    onValueChange={(value) => setState({ ...state, uf: value })}
                  >
                    <SelectTrigger size="sm" aria-label="Estado do DDD">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Todos os estados (DDD)</SelectItem>
                      {UFS.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf} ({BRAZIL_DDDS_BY_UF[uf].join(', ')})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          />
        </section>
      </main>
    </div>
  )
}

export default App
