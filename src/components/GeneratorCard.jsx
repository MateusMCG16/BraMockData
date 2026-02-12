import React, { useState, useEffect } from 'react';
import { Tile, Button, TextInput, CopyButton, Toggle } from '@carbon/react';
import { Renew } from '@carbon/icons-react';

const GeneratorCard = ({ title, generator, optionsComponent }) => {
    const [value, setValue] = useState('');
    const [formatted, setFormatted] = useState(true);
    const [optionsState, setOptionsState] = useState({});

    const handleGenerate = () => {
        // Pass optionsState to the generator if it accepts it.
        // Currently only 'Telefone' uses options, but this structure allows expansion.
        if (title === 'Telefone') {
            setValue(generator(formatted, optionsState.type || 'any'));
        } else {
            setValue(generator(formatted));
        }
    };

    // Regenerate when format or options change, only if value exists
    useEffect(() => {
        if (value) {
            handleGenerate();
        }
    }, [formatted, optionsState]);

    return (
        <Tile className="generator-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h4 style={{ margin: 0 }}>{title}</h4>
                <Toggle
                    id={`toggle-${title}`}
                    aria-label="Toggle format"
                    labelText="Formatar"
                    labelA="Raw"
                    labelB="Fmt"
                    toggled={formatted}
                    onToggle={() => setFormatted(!formatted)}
                />
            </div>

            <div style={{ flexGrow: 1 }}>
                {optionsComponent && (
                    <div style={{ marginBottom: '1rem' }}>
                        {optionsComponent(optionsState, setOptionsState)}
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '0.5rem',
                    marginBottom: '1.5rem'
                }}>
                    <TextInput
                        id={`input-${title}`}
                        labelText="Result"
                        hideLabel
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
            </div>

            <Button
                renderIcon={Renew}
                onClick={handleGenerate}
                isExpressive
                style={{ width: '100%' }}
            >
                Generate
            </Button>
        </Tile>
    );
};

export default GeneratorCard;
