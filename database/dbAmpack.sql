-- MySQL Script generated by MySQL Workbench
-- Thu Mar  7 09:53:59 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema ampackProject
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `ampackProject` ;

-- -----------------------------------------------------
-- Schema ampackProject
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `ampackProjectusuariousuariousuario` ;
USE `ampackProject` ;

-- -----------------------------------------------------
-- Table `ampackProject`.`Usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ampackProject`.`Usuario` ;

CREATE TABLE IF NOT EXISTS `ampackProject`.`Usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Nombres` VARCHAR(100) NOT NULL,
  `Apellidos` VARCHAR(100) NULL,
  `Telefono` VARCHAR(20) NOT NULL,
  `Correo` VARCHAR(100) NOT NULL,
  `Direccion` VARCHAR(100) NULL,
  `Ciudad` VARCHAR(45) NULL,
  `Contraseña` VARCHAR(100) NOT NULL,
  `Rol` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ampackProject`.`Transacciones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ampackProject`.`Transacciones` ;

CREATE TABLE IF NOT EXISTS `ampackProject`.`Transacciones` (
  `CodigoTransaccion` INT NOT NULL,
  `Fecha` DATE NOT NULL,
  `Cantidad` INT NOT NULL,
  `TotalTransaccion` FLOAT NOT NULL,
  `Direccionl` VARCHAR(80) NOT NULL,
  `Ciudad` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`CodigoTransaccion`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ampackProject`.`Productos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ampackProject`.`Productos` ;

CREATE TABLE IF NOT EXISTS `ampackProject`.`Productos` (
  `Codigo` INT NOT NULL AUTO_INCREMENT,
  `NombreProd` VARCHAR(60) NOT NULL,
  `TipoMaterial` VARCHAR(60) NOT NULL,
  `CantidadDisponible` INT NOT NULL,
  `cantidadVendida` INT NOT NULL,
  `ValorProducto` FLOAT NOT NULL,
  `img` VARCHAR(300) NOT NULL,
  `Transacciones_CodigoTransaccion` INT,
  PRIMARY KEY (`Codigo`),
  INDEX `fk_Productos_Transacciones1_idx` (`Transacciones_CodigoTransaccion` ASC),
  CONSTRAINT `fk_Productos_Transacciones1`
    FOREIGN KEY (`Transacciones_CodigoTransaccion`)
    REFERENCES `ampackProject`.`Transacciones` (`CodigoTransaccion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ampackProject`.`Compra`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ampackProject`.`Compra` ;

CREATE TABLE IF NOT EXISTS `ampackProject`.`Compra` (
  `Cliente_id` INT NOT NULL,
  `Productos_Codigo` INT NOT NULL,
  PRIMARY KEY (`Cliente_id`, `Productos_Codigo`),
  INDEX `fk_Cliente_has_Productos_Productos1_idx` (`Productos_Codigo` ASC) VISIBLE,
  INDEX `fk_Cliente_has_Productos_Cliente_idx` (`Cliente_id` ASC) VISIBLE,
  CONSTRAINT `fk_Cliente_has_Productos_Cliente`
    FOREIGN KEY (`Cliente_id`)
    REFERENCES `ampackProject`.`Usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Cliente_has_Productos_Productos1`
    FOREIGN KEY (`Productos_Codigo`)
    REFERENCES `ampackProject`.`Productos` (`Codigo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ampackProject`.`Hace`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ampackProject`.`Hace` ;

CREATE TABLE IF NOT EXISTS `ampackProject`.`Hace` (
  `Cliente_id` INT NOT NULL,
  `Transacciones_CodigoTransaccion` INT NOT NULL,
  PRIMARY KEY (`Cliente_id`, `Transacciones_CodigoTransaccion`),
  INDEX `fk_Cliente_has_Transacciones_Transacciones1_idx` (`Transacciones_CodigoTransaccion` ASC) VISIBLE,
  INDEX `fk_Cliente_has_Transacciones_Cliente1_idx` (`Cliente_id` ASC) VISIBLE,
  CONSTRAINT `fk_Cliente_has_Transacciones_Cliente1`
    FOREIGN KEY (`Cliente_id`)
    REFERENCES `ampackProject`.`Usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Cliente_has_Transacciones_Transacciones1`
    FOREIGN KEY (`Transacciones_CodigoTransaccion`)
    REFERENCES `ampackProject`.`Transacciones` (`CodigoTransaccion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
