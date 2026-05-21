import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Translate from '@docusaurus/Translate';

const FeatureList = [
  {
    title: (
      <> <Translate id="feature.1.title">Configuración modular</Translate></>
    ),
    description: (
      <>
        <Translate id="feature.1.description">Use solo las secciones que necesita para su proyecto.</Translate>
      </>
    ),
  },
  {
    title: (
      <> <Translate id="feature.2.title">Totally Secure CI/CD</Translate></>),
    description: (
      <>
        <Translate id="feature.2.description">Compilación, creación de imágenes/artefactos, implementación y pruebas totalmente seguras de sus aplicaciones, un proceso completo de "desplazamiento a la izquierda", detección de la mayoría de las vulnerabilidades antes del entorno de producción y mitigación de todos estos problemas a tiempo  </Translate>    </>
    ),
  },
  {
    title: (<> <Translate id="feature.3.title">OpenSource-Powered</Translate></>),
    description: (
      <>
       <Translate id="feature.3.description"> Diseñado con software libre para que todos disfruten.</Translate>
      </>
    ),
  },
];

function Feature({ title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
