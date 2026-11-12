import React, { useEffect, useState } from 'react'
import { Braces, Moon, Sun } from 'lucide-react'
import GeneratorCard from '@/components/GeneratorCard'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Braces className="size-4" />
            </div>
            <span className="font-semibold tracking-tight">BraMockData</span>
            <span className="hidden rounded-md border px-2 py-0.5 text-xs text-muted-foreground sm:inline-block">
              Dev Tools
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label={darkMode ? 'Ativar tema claro' : 'Ativar tema escuro'}
            title={darkMode ? 'Tema claro' : 'Tema escuro'}
          >
            {darkMode ? <Sun /> : <Moon />}
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <section className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Brazilian Mock Data
          </h1>
          <p className="text-muted-foreground">
            Gere documentos e dados brasileiros aleatórios válidos para seus
            testes.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <GeneratorCard
            title="CPF"
            generator={generateCPF}
            formatter={formatCPF}
          />
          <GeneratorCard
            title="CNPJ"
            generator={generateCNPJ}
            formatter={formatCNPJ}
          />
          <GeneratorCard
            title="RG"
            generator={generateRG}
            formatter={formatRG}
          />
          <GeneratorCard
            title="CEP"
            generator={generateCEP}
            formatter={formatCEP}
          />
          <GeneratorCard
            title="Cartão de Crédito"
            generator={generateCreditCard}
            formatter={formatCreditCard}
          />
          <GeneratorCard
            title="Data"
            generator={generateDate}
            formatter={formatDate}
          />
          <GeneratorCard
            title="Telefone"
            generator={generatePhone}
            formatter={formatPhone}
            initialOptions={{ type: 'any' }}
            optionsComponent={(state, setState) => (
              <RadioGroup
                value={state.type || 'any'}
                onValueChange={(value) => setState({ ...state, type: value })}
                className="flex flex-wrap items-center gap-4"
                aria-label="Tipo de telefone"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="any" id="phone-any" />
                  <Label htmlFor="phone-any" className="cursor-pointer font-normal">
                    Qualquer
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="mobile" id="phone-mobile" />
                  <Label htmlFor="phone-mobile" className="cursor-pointer font-normal">
                    Celular
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="landline" id="phone-landline" />
                  <Label htmlFor="phone-landline" className="cursor-pointer font-normal">
                    Fixo
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
        </section>
      </main>
    </div>
  )
}

export default App
