import { NextFunction, Request, Response } from "express";
import _ from "lodash";

// Función middleware para convertir las claves de las solicitudes y respuestas a camelCase
export function convertKeysToCamelCase(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const originalSend = res.send;

  // Sobrescribe la función `res.send` para realizar la conversión de claves antes de enviar la respuesta
  res.send = function (data: any) {
    if (_.isObject(data)) {
      data = convertKeys(data);
    }
    return originalSend.call(this, data);
  };
  next();
}

// Función para convertir las claves de un objeto a camelCase
function convertKeys(obj: any): any {
  if (_.isArray(obj)) {
    return obj.map((item: any) => convertKeys(item));
  } else if (_.isObject(obj)) {
    return _.mapKeys(obj, (value, key) => _.camelCase(key));
  }
  return obj;
}
