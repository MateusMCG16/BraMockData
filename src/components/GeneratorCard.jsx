import React, { useState } from 'react';
import { Tile, Button, TextInput, CopyButton, Toggle } from '@carbon/react';
import { Renew } from '@carbon/icons-react';

const GeneratorCard = ({ title, generator, optionsComponent }) => {
    const [value, setValue] = useState('');
    const [formatted, setFormatted] = useState(true);
    const [optionsState, setOptionsState] = useState({});

    const handleGenerate = () => {
        // Pass optionsState to the generator if it accepts it
        // We assume the generator signature is (formatted, ...options) or similar, 
        // but since we only have one case with options (phone), we can adapt.
        // For phone: generator(formatted, type)
        // For others: generator(formatted)

        if (title === 'Telefone') {
            setValue(generator(formatted, optionsState.type || 'any'));
        } else {
            setValue(generator(formatted));
        }
    };

    // Regenerate when format changes if we already have a value
    React.useEffect(() => {
        if (value) {
            handleGenerate();
        }
    }, [formatted, optionsState]); // Also regenerate when options change

    return (
        <Tile className="generator-card">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{title}</h4>
                <Toggle
                    id={`toggle-${title}`}
                    size="sm"
                    labelText="Format"
                    toggled={formatted}
                    onToggle={() => setFormatted(!formatted)}
                />
            </div>

            {optionsComponent && (
                <div style={{ marginBottom: '1rem' }}>
                    {optionsComponent(optionsState, setOptionsState)}
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
                <TextInput
                    id={`input-${title}`}
                    labelText=""
                    value={value}
                    readOnly
                    placeholder="Click generate"
                    style={{ flexGrow: 1 }}
                />
                <CopyButton
                    iconDescription="Copy to clipboard"
                    feedback="Copied!"
                    onClick={() => {
                        if (value) navigator.clipboard.writeText(value);
                    }}
                />
            </div>

            <Button renderIcon={Renew} onClick={handleGenerate} isExpressive>
                Generate
            </Button>
        </Tile>
    );
};

export default GeneratorCard;
