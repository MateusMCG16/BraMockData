import React, { useState, useRef, useEffect } from 'react'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
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
  description,
  generator,
  formatter,
  supportsFormat = true,
  optionsComponent,
  initialOptions = {},
  className,
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

  const slug = title.toLowerCase().replace(/\s+/g, '-')
  const switchId = `format-${slug}`
  const inputId = `result-${slug}`

  return (
    <Card
      className={cn(
        'h-full transition-colors hover:border-foreground/20',
        className
      )}
    >
      <CardHeader className="items-start">
        <div className="space-y-0.5">
          <CardTitle className="text-sm">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {supportsFormat && (
          <div className="flex shrink-0 items-center gap-1.5">
            <Label
              htmlFor={switchId}
              className="text-[11px] text-muted-foreground cursor-pointer"
            >
              {formatted ? 'Fmt' : 'Bruto'}
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

      <CardContent className="flex flex-col justify-between gap-2.5">
        {optionsComponent ? (
          <div>{optionsComponent(optionsState, handleOptionsChange)}</div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1.5">
          <Input
            id={inputId}
            aria-label={`Resultado de ${title}`}
            value={value}
            readOnly
            placeholder="Clique em gerar"
            className="h-8 font-mono text-[13px]"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-8 shrink-0"
            onClick={handleCopy}
            disabled={!value}
            aria-label={copied ? `${title} copiado` : `Copiar ${title}`}
            title={copied ? 'Copiado!' : 'Copiar'}
          >
            {copied ? <Check className="text-emerald-500" /> : <Copy />}
          </Button>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          size="sm"
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
