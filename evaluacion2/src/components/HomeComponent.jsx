import React, { Component } from "react";
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components'


export default function Home(){
    
    return (
        <div>
            <GlobalStyle />
            <HomeStyle>
                <h1 className="text-center"> <b>TopEducation</b></h1>
                <div class="box-area">
                    <div class="single-box">
                        <a href="/register">
                            <div class="img-area">
                            </div>
                        </a>
                        <div class="img-text">
                            <span class="header-text"><strong>Registrar estudiante</strong></span>
                        </div>
                    </div>
                    <div class="single-box">
                        <a href="/estudiantes">
                            <div class="img-area">
                            </div>
                        </a>
                        <div class="img-text">
                            <span class="header-text"><strong>Ver estudiantes</strong></span>
                        </div>
                    </div>
                    <div class="single-box">
                        <a href="/">
                            <div class="img-area"></div>
                        </a>
                        <div class="img-text">
                            <span class="header-text"><strong>Generar cuotas</strong></span>
                            <p></p>
                        </div>
                    </div>
                    <div class="single-box">
                        <a href="/">
                            <div class="img-area"></div>
                        </a>
                        <div class="img-text">
                            <span class="header-text"><strong>Ver cuotas</strong></span>
                            <p></p>
                        </div>
                    </div>
                    <div class="single-box">
                        <a href="/">
                            <div class="img-area"></div>
                        </a>
                        <div class="img-text">
                            <span class="header-text"><strong>Subir notas</strong></span>
                        </div>
                    </div>
                    <div class="single-box">
                        <a href="/">
                            <div class="img-area"></div>
                        </a>
                        <div class="img-text">
                            <span class="header-text"><strong>Notas</strong></span>
                        </div>
                    </div>
                    <div class="single-box">
                        <a href="/">
                            <div class="img-area"></div>
                        </a>
                        <div class="img-text">
                            <span class="header-text"><strong>Generar resumen</strong></span>
                        </div>
                    </div>
                </div>
            </HomeStyle>
        </div>
    );
}



const GlobalStyle = createGlobalStyle`
    body { 
        background-color: #262626;
`
const HomeStyle = styled.nav`

.text-center {
    text-align: center;
    justify-content: center;
    padding-top: 8px;
    color: #fff;
}

.box-area{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

.single-box{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 400px;
    height: auto;
    border-radius: 4px;
    background-color: #fff;
    text-align: center;
    margin: 20px;
    padding: 20px;
    transition: .3s
}

.img-area{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border: 6px solid #ddd;
    border-radius: 50%;
    padding: 20px;
    -webkit-background-size: cover;
    background-size: cover;
    background-position: center center;
}

.single-box:nth-child(1) .img-area{
    background-image: url(https://cdn-icons-png.flaticon.com/512/306/306232.png)
}

.header-text{
    font-size: 23px;
    font-weight: 500;
    line-height: 48px;
}
.img-text p{
    font-size: 15px;
    font-weight: 400;
    line-height: 30px;
}
.single-box:hover{
    background: #e84393;
    color: #fff;}

.single-box:nth-child(2) .img-area{
        background-image: url(https://w7.pngwing.com/pngs/241/840/png-transparent-computer-icons-student-school-student-angle-people-logo.png)
}
.single-box:nth-child(3) .img-area{
        background-image: url(https://img.freepik.com/iconos-gratis/beneficios_318-283963.jpg)
}
.single-box:nth-child(4) .img-area{
        background-image: url(https://cdn-icons-png.flaticon.com/512/1028/1028911.png)
}
.single-box:nth-child(5) .img-area{
        background-image: url(https://cdn-icons-png.flaticon.com/512/338/338864.png)
}

.single-box:nth-child(6) .img-area{
    background-image: url(https://cdn-icons-png.flaticon.com/512/429/429356.png)
}

.single-box:nth-child(7) .img-area{
    background-image: url(https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/compose-512.png)
}
.login-box{
    cursor: pointer;
}
`