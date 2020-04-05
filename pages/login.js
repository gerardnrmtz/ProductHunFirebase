import React, { useState } from "react";
import Router from "next/router";
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
import validarIniciarSesion from "../validacion/validarIniciarSesion";

const H1styled = styled.h1`
  text-align:center;
  margin-top:5;rem;
`;
const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: ""
};
const Login = () => {
  const [error, guardarError] = useState(false);
  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handeBlur
  } = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;
  async function iniciarSesion() {
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.error("Hubo un error al iniciar sesion", error.message);
      guardarError(error.message);
    }
  }
  return (
    <div>
      <Layout>
        <>
          <H1styled>Iniciar sesion</H1styled>
          <Formulario onSubmit={handleSubmit} noValidate>
            <Campo>
              <label htmlFor="email">Email</label>
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
              <label htmlFor="password">Password</label>
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
            <InputSubmit type="submit" value="Iniciar sesion" />
          </Formulario>
        </>
      </Layout>
    </div>
  );
};
export default Login;
