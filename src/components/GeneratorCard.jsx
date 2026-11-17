import { useState, useRef, useEffect, useId, useImperativeHandle } from 'react'
import { AlertCircle, Check, Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const GeneratorCard = (props) => {
  const {
    ref, id, title, description, icon: Icon, generator, formatter,
    optionsComponent: Options, initialOptions = {}, active,
  } = props
  const [value, setValue] = useState('')
  const [formatted, setFormatted] = useState(true)
  const [options, setOptions] = useState(initialOptions)
  const [copyState, setCopyState] = useState('idle')
  const copyTimeout = useRef(null)
  const valueVersion = useRef(0)
  const fieldId = useId()

  useEffect(() => () => {
    valueVersion.current += 1
    clearTimeout(copyTimeout.current)
  }, [])

  const resetCopy = () => {
    valueVersion.current += 1
    clearTimeout(copyTimeout.current)
    setCopyState('idle')
  }

  const handleGenerate = (nextFormatted = formatted, nextOptions = options) => {
    resetCopy()
    setValue(generator(nextFormatted, nextOptions))
  }

  useImperativeHandle(ref, () => ({ generate: () => handleGenerate() }))

  const handleFormatChange = (checked) => {
    resetCopy()
    setFormatted(checked)
    if (value) setValue(formatter(value, checked))
  }

  const handleOptionsChange = (nextOptions) => {
    setOptions(nextOptions)
    if (value) handleGenerate(formatted, nextOptions)
  }

  const handleCopy = async () => {
    if (!value) return
    const version = valueVersion.current
    try {
      await navigator.clipboard.writeText(value)
      if (version !== valueVersion.current) return
      setCopyState('copied')
      clearTimeout(copyTimeout.current)
      copyTimeout.current = setTimeout(() => setCopyState('idle'), 1800)
    } catch {
      if (version === valueVersion.current) setCopyState('error')
    }
  }

  const copyLabel = copyState === 'copied'
    ? `${title} copiado`
    : copyState === 'error' ? 'Não foi possível copiar. Selecione o resultado e copie manualmente.' : `Copiar ${title}`

  return (
    <article id={`generator-${id}`} className="generator-row" data-active={active}
      aria-labelledby={`${fieldId}-title`}>
      <div className="generator-identity">
        <span className="generator-icon"><Icon aria-hidden="true" /></span>
        <div>
          <h2 id={`${fieldId}-title`}>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="generator-options">
        <span className="mobile-field-label">Configurações</span>
        <Options options={options} onChange={handleOptionsChange} />
      </div>

      <div className="generator-result">
        <Label className="mobile-field-label" htmlFor={`${fieldId}-result`}>Resultado</Label>
        <Input id={`${fieldId}-result`} aria-label={`Resultado de ${title}`}
          value={value} readOnly placeholder="Clique em gerar" className="result-input"
          onFocus={(event) => event.target.select()} />
        <span className={`copy-feedback ${copyState === 'error' ? 'copy-error' : ''}`}
          role="status" aria-live="polite">
          {copyState === 'copied' ? 'Copiado para a área de transferência' : copyState === 'error' ? 'Selecione o resultado para copiar manualmente' : ''}
        </span>
      </div>

      <div className="generator-format">
        <Label className="mobile-field-label" htmlFor={`${fieldId}-format`}>Usar máscara</Label>
        <Switch id={`${fieldId}-format`} checked={formatted}
          onCheckedChange={handleFormatChange} aria-label={`Usar máscara em ${title}`} />
      </div>

      <div className="generator-actions">
        <Button type="button" variant="outline" className="generate-button"
          onClick={() => handleGenerate()} aria-label={`Gerar ${title}`}>
          <RefreshCw aria-hidden="true" /><span>Gerar</span>
        </Button>
        <Button type="button" variant="ghost" size="icon" className="copy-button"
          data-copy-state={copyState} onClick={handleCopy} disabled={!value}
          aria-label={copyLabel} title={copyLabel}>
          {copyState === 'copied' ? <Check /> : copyState === 'error' ? <AlertCircle /> : <Copy />}
        </Button>
      </div>
    </article>
  )
}

export default GeneratorCard
