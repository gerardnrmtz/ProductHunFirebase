import React,{useState} from "react";
import Router from 'next/router';
import Layout from "../components/layouts/Layout";
import {
  Formulario,
  Campo,
  InputSubmit,
  Error
} from "../components/ui/Formulario";

import firebase from "../firebase";
import styled from "@emotion/styled";
//Validaciones
import useValidacion from "../hooks/useValidacion";
import validarCrearCuenta from "../validacion/validarCrearCuenta";

const H1styled = styled.h1`
  text-align:center;
  margin-top:5;rem;
`;
const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: ""
};
const CrearCuenta = () => {
  const [error,guardarError]=useState(false);
  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handeBlur
  } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores;

  async function crearCuenta() {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push('/');
    } catch (error) {
      console.error("Hubo un error al crear el usuario", error.message);
      guardarError(error.message);
    }
  }
  return (
    <div>
      <Layout>
        <>
          <H1styled>CrearCuenta</H1styled>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                onBlur={handeBlur}
              />
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}
            <Campo>
              <label htmlFor="nombre">Email</label>
              <input
                type="email"
                id="email"
                placeholder="email"
                name="email"
                value={email}
                onChange={handleChange}
                onBlur={handeBlur}
              />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}
            <Campo>
              <label htmlFor="nombre">Password</label>
              <input
                type="password"
                id="password"
                placeholder="tu password"
                name="password"
                value={password}
                onChange={handleChange}
                onBlur={handeBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            {error && <Error>{error}</Error>}
            <InputSubmit type="submit" value="Crear Cuenta" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};

export default CrearCuenta;
