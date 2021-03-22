"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_ENGINE = void 0;
/**
 * @description Define supported database engines
 */
var DATABASE_ENGINE;
(function (DATABASE_ENGINE) {
    DATABASE_ENGINE["mysql"] = "mysql";
    DATABASE_ENGINE["mariadb"] = "mariadb";
    DATABASE_ENGINE["postgres"] = "postgres";
    DATABASE_ENGINE["cockroachdb"] = "cockroachdb";
    DATABASE_ENGINE["sqlite"] = "sqlite";
    DATABASE_ENGINE["mssql"] = "mssql";
    DATABASE_ENGINE["sap"] = "sap";
    DATABASE_ENGINE["oracle"] = "oracle";
    DATABASE_ENGINE["cordova"] = "cordova";
    DATABASE_ENGINE["nativescript"] = "nativescript";
    DATABASE_ENGINE["react-native"] = "react-native";
    DATABASE_ENGINE["sqljs"] = "sqljs";
    DATABASE_ENGINE["mongodb"] = "mongodb";
    DATABASE_ENGINE["aurora-data-api"] = "aurora-data-api";
    DATABASE_ENGINE["aurora-data-api-pg"] = "aurora-data-api-pg";
    DATABASE_ENGINE["expo"] = "expo";
    DATABASE_ENGINE["better-sqlite3"] = "better-sqlite3";
})(DATABASE_ENGINE = exports.DATABASE_ENGINE || (exports.DATABASE_ENGINE = {}));
