# Etapa 1: Construcción del .jar usando Maven y JDK 21
FROM maven:3.9.3-eclipse-temurin-21 AS build
WORKDIR /app

# Copia archivos necesarios para la compilación
COPY pom.xml .
COPY src ./src

# Construye el proyecto y empaqueta sin correr tests para acelerar
RUN mvn clean package -DskipTests

# Etapa 2: Imagen ligera para correr la app con Java Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copia el .jar compilado de la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Expone el puerto donde corre tu app Spring Boot (por defecto 8080)
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]

