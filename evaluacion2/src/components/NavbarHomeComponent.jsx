import React from "react";
import styled from "styled-components";

function NavbarHomeComponent(){
    return(
        <>
        <NavStyle>
            <header class="header">
                <div class="logo">
                    <h1>TopEducation</h1>
                </div>
                <nav>
                </nav>
            </header>
            </NavStyle>
        </>
    )
}

export default NavbarHomeComponent;


const NavStyle = styled.nav`
.header{
    background-color: #0078D4;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 85px;
    padding: 5px 10%;
  }
.header .logo{
    margin-right: auto;
    color: white;
    font-family: 'Pacifico',serif;
  }
.header .btn button{
    margin-left: 20px;
    font-weight: 700;
    color: #1b3039;
    padding: 9px 25px;
    background: #eceff1;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease 0s;
  }
.header .btn button:hover{
    background-color: #e2f1f8;
    color: #ffbc0e;
    transform: scale(1.1);
  }
`