FROM java:8-jdk

ADD  target/retro-1.0-SNAPSHOT.jar /xetro/xetro.jar

ENTRYPOINT ["java", "-jar", "/xetro/xetro.jar"]
