# Usa una imagen base con Java 21 (adaptada a tu versión)
FROM eclipse-temurin:21-jre-alpine

# Copia el jar generado en el contenedor
COPY target/proyecto-web-0.0.1-SNAPSHOT.jar app.jar

# Expone el puerto donde correrá la app
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java","-jar","/app.jar"]
