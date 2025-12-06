import React from 'react';
import { Header, HeaderName, Content, Theme, RadioButton, RadioButtonGroup } from '@carbon/react';
import GeneratorCard from './components/GeneratorCard';
import { generateCPF, generateCNPJ, generateRG, generatePhone } from './utils/generators';
import './App.scss';

function App() {
  return (
    <Theme theme="g100" className="app-theme">
      <Header aria-label="Brazilian Data Generator">
        <HeaderName href="#" prefix="Dev">
          Tools
        </HeaderName>
      </Header>
      <Content className="app-content">
        <div style={{ marginTop: '2rem' }}>
          <h1 style={{ marginBottom: '0.5rem', fontWeight: 300 }}>Brazilian Mock Data</h1>
          <p style={{ marginBottom: '2rem', color: 'var(--cds-text-secondary)' }}>
            Generate valid random documents for testing purposes.
          </p>
        </div>
        <div className="generator-grid">
          <GeneratorCard title="CPF" generator={generateCPF} />
          <GeneratorCard title="CNPJ" generator={generateCNPJ} />
          <GeneratorCard title="RG" generator={generateRG} />
          <GeneratorCard
            title="Telefone"
            generator={generatePhone}
            optionsComponent={(state, setState) => (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <RadioButtonGroup
                  name="phone-type-group"
                  defaultSelected="any"
                  orientation="horizontal"
                  onChange={(value) => setState({ ...state, type: value })}
                >
                  <RadioButton value="any" id="radio-any" labelText="Qualquer" />
                  <RadioButton value="mobile" id="radio-mobile" labelText="Celular" />
                  <RadioButton value="landline" id="radio-landline" labelText="Fixo" />
                </RadioButtonGroup>
              </div>
            )}
          />
        </div>
      </Content>
    </Theme>
  );
}

export default App;
