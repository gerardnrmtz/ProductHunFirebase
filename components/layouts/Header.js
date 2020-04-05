import React, { useContext } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Buscar from "../ui/Buscar";
import Navegacion from "./Navegacion";
import Boton from "../ui/Boton";
import {FirebaseContext} from '../../firebase';

const ContenedorHeader = styled.div`
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  @media (min-width: 768px) {
    display: flex;
    justify-content: space-between;
  }
`;
const HeaderStyle = styled.header`
  border-bottom: 2px solid var(--gris3);
  padding: 1rem 0;
`;
const DivStyled = styled.div`
  display: flex;
  align-items: center;
`;
const PStyled = styled.p`
  margin-right: 2rem;
`;
const Logo = styled.a`
  color: var(--naranja);
  font-size: 4rem;
  font-weight: 700;
  font-family: "Roboto Slab", serif;
  margin-right: 2rem;
  &:hover{
    cursor:pointer;
  }
`;
const color = 'darkgreen'
const Header = () => {
  const {usuario,firebase}=useContext(FirebaseContext);

  return (
    <HeaderStyle>
      <ContenedorHeader>
      <DivStyled>
        
          <Link href="/">
            <Logo>P</Logo>
          </Link>

          <Buscar />
          <Navegacion />
        </DivStyled>
        <DivStyled>
          {usuario ? (
            <>
              <PStyled>Hola : {usuario.displayName}</PStyled>
              <Boton bgColor="true" type="button"
                onClick={()=> firebase.cerrarSesion()}
              >
                Cerrar sesion
              </Boton>
            </>
          ) : (
            <>
              <Link href="/login">
                <Boton bgColor="true">Login</Boton>
              </Link>
              <Link href="/crear-cuenta">
                <Boton>Crear cuenta</Boton>
              </Link>
            </>
          )}
        </DivStyled>
      </ContenedorHeader>
    </HeaderStyle>
  );
};

export default Header;
