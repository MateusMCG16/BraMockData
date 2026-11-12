import React, { useState, useRef, useEffect } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const GeneratorCard = ({
  title,
  generator,
  formatter,
  supportsFormat = true,
  optionsComponent,
  initialOptions = {},
}) => {
  const [value, setValue] = useState('')
  const [formatted, setFormatted] = useState(true)
  const [optionsState, setOptionsState] = useState(initialOptions)
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const handleGenerate = (nextFormatted = formatted, nextOptions = optionsState) => {
    setValue(generator(nextFormatted, nextOptions))
    setCopied(false)
  }

  const handleFormatChange = (checked) => {
    setFormatted(checked)
    if (!value) return

    if (formatter) {
      setValue(formatter(value, checked))
    } else {
      handleGenerate(checked, optionsState)
    }
  }

  const handleOptionsChange = (updater) => {
    const nextOptions =
      typeof updater === 'function' ? updater(optionsState) : updater
    setOptionsState(nextOptions)
    if (value) {
      handleGenerate(formatted, nextOptions)
    }
  }

  const handleCopy = async () => {
    if (!value || !navigator.clipboard) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const switchId = `format-${title.toLowerCase().replace(/\s+/g, '-')}`
  const inputId = `result-${title.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <Card className="h-full transition-colors hover:border-foreground/20">
      <CardHeader className="items-center">
        <CardTitle className="text-base">{title}</CardTitle>
        {supportsFormat && (
          <div className="flex items-center gap-2">
            <Label
              htmlFor={switchId}
              className="text-xs text-muted-foreground cursor-pointer"
            >
              {formatted ? 'Formatado' : 'Bruto'}
            </Label>
            <Switch
              id={switchId}
              checked={formatted}
              onCheckedChange={handleFormatChange}
              aria-label={`Alternar formatação de ${title}`}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex flex-col justify-end gap-4">
        {optionsComponent && (
          <div>{optionsComponent(optionsState, handleOptionsChange)}</div>
        )}

        <div className="flex items-center gap-2">
          <Input
            id={inputId}
            aria-label={`Resultado de ${title}`}
            value={value}
            readOnly
            placeholder="Clique em gerar"
            className="font-mono text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={!value}
            aria-label={copied ? `${title} copiado` : `Copiar ${title}`}
            title={copied ? 'Copiado!' : 'Copiar'}
          >
            {copied ? (
              <Check className="text-emerald-500" />
            ) : (
              <Copy />
            )}
          </Button>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          className="w-full"
          onClick={() => handleGenerate()}
        >
          <RefreshCw />
          Gerar
        </Button>
      </CardFooter>
    </Card>
  )
}

export default GeneratorCard
