// Configuración compartida por los scripts clásicos, también compatible con file://.
window.AntesDeEnviar = window.AntesDeEnviar || {};
(function (app) {
const CATEGORY_ORDER = [
  "cedula",
  "nombreCompleto",
  "pasaporte",
  "rif",
  "telefono",
  "correo",
  "cuenta",
  "tarjeta",
  "codigoSeguridad",
  "ticket",
  "planilla",
  "direccionIp",
  "direccion",
  "manual",
];

const CATEGORY_CONFIG = {
  cedula: {
    title: "Cédulas",
    icon: "ID",
    singular: "cédula",
    plural: "cédulas",
    defaultLabel: "[CÉDULA]",
    description: "Se reconoce por un prefijo V-/E- o por una etiqueta de identidad cercana.",
  },
  nombreCompleto: {
    title: "Nombres completos",
    icon: "NOM",
    singular: "nombre completo",
    plural: "nombres completos",
    defaultLabel: "[NOMBRE]",
    description: "Se reconoce junto a «me llamo», roles como «aspirante» o títulos como «Lic.»; la detección es orientativa.",
  },
  pasaporte: {
    title: "Pasaportes",
    icon: "PAS",
    singular: "pasaporte",
    plural: "pasaportes",
    defaultLabel: "[PASAPORTE]",
    description: "Se reconoce cuando un número alfanumérico aparece junto a «pasaporte».",
  },
  rif: {
    title: "RIF",
    icon: "RIF",
    singular: "RIF",
    plural: "RIF",
    defaultLabel: "[RIF]",
    description: "Se reconoce por el prefijo fiscal junto a «RIF».",
  },
  telefono: {
    title: "Teléfonos",
    icon: "TEL",
    singular: "teléfono",
    plural: "teléfonos",
    defaultLabel: "[TELÉFONO]",
    description: "Se reconoce por un prefijo internacional o por términos como «teléfono» y «número de teléfono».",
  },
  correo: {
    title: "Correos electrónicos",
    icon: "@",
    singular: "correo",
    plural: "correos",
    defaultLabel: "[CORREO]",
    description: "Se reconoce por un patrón de dirección de correo electrónico.",
  },
  cuenta: {
    title: "Cuentas bancarias",
    icon: "CTA",
    singular: "cuenta bancaria",
    plural: "cuentas bancarias",
    defaultLabel: "[CUENTA BANCARIA]",
    description: "Se reconoce junto a «cuenta bancaria» o «account number», no por números aislados.",
  },
  tarjeta: {
    title: "Tarjetas de pago",
    icon: "TAR",
    singular: "tarjeta",
    plural: "tarjetas",
    defaultLabel: "[TARJETA]",
    description: "Se reconoce junto a «tarjeta», Visa, Mastercard u otra marca.",
  },
  codigoSeguridad: {
    title: "Códigos de seguridad",
    icon: "COD",
    singular: "código de seguridad",
    plural: "códigos de seguridad",
    defaultLabel: "[CÓDIGO]",
    description: "Se reconoce junto a CVV, código de seguridad o código de verificación; no como documento.",
  },
  ticket: {
    title: "Tickets de soporte",
    icon: "TKT",
    singular: "ticket",
    plural: "tickets",
    defaultLabel: "[TICKET]",
    description: "Se reconoce junto a «ticket de soporte» o «support ticket».",
  },
  planilla: {
    title: "Códigos de planilla",
    icon: "PLN",
    singular: "código de planilla",
    plural: "códigos de planilla",
    defaultLabel: "[PLANILLA]",
    description: "Se reconoce junto a «código de planilla», no por códigos de aula aislados.",
  },
  direccionIp: {
    title: "Direcciones IP",
    icon: "IP",
    singular: "dirección IP",
    plural: "direcciones IP",
    defaultLabel: "[DIRECCIÓN IP]",
    description: "Se reconoce una dirección IPv4 completa y válida.",
  },
  direccion: {
    title: "Direcciones postales",
    icon: "DIR",
    singular: "dirección",
    plural: "direcciones",
    defaultLabel: "[DIRECCIÓN]",
    description: "Se reconoce junto a palabras como «calle», «avenida» o «domicilio».",
  },
  manual: {
    title: "Selección manual",
    icon: "…",
    singular: "fragmento",
    plural: "fragmentos",
    defaultLabel: "[DATO]",
    description: "Fragmentos que seleccionaste directamente en el texto.",
  },
};

const DEMO_TEXT = "Me llamo Ana María Pérez; C.I. V-16.731.908; pasaporte A7392014; tel. 0414-5550198; ana@example.com; cuenta 0105-0072-19-3008412590; tarjeta Visa 4111-1111-1111-1111, CVV 918; ticket #883920; IP 192.168.1.10; Calle 5, Valencia.";

app.config = { CATEGORY_ORDER, CATEGORY_CONFIG, DEMO_TEXT };
})(window.AntesDeEnviar);
