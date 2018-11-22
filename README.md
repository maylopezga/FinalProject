# FinalProject

## Problema
El problema que se presenta es la mala comunicación entre dos partes, ocasionando que esto afecte en el desarrollo de diferentes eventos. Dichos eventos son creados con un objetivo y para sus adecuado desarrollo es indispensable la participación de las personas que desean asistir al mismo, así como la confirmación previa y la asistencia al mismo.

## Solución planteada
La solución que se planteó fue el desarrollo de un bot, este implementando la integración de dos grandes canales, Slack es el medio en el que se notificará de los evento a las personas y Meetup de donde se obtendrá toda la información necesaria del evento.

## Desarrollo de la solución
El código fuente cuenta con un archivo de configuración (package.json) y un archivo con las funciones necesarias (server.js), estas funciones son peticiones HTTP con métodos GET y POST para lograr obtener la información necesaria y notificarla a la persona que lo desea, además cuenta con otras funciones que procesan la información obtenida para finalmente enviarla al usuario.
