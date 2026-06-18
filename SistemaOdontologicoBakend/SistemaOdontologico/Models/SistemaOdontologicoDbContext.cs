namespace SistemaOdontologico.Models;
  using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

  public class SistemaOdontologicoDbContext: DbContext
  {
  public SistemaOdontologicoDbContext()
  {
  }

  public SistemaOdontologicoDbContext(DbContextOptions<SistemaOdontologicoDbContext> options)
      : base(options)
  {
  }

  public DbSet<Usuario> Usuario { get; set; }
  //public virtual DbSet<Rol> Rols { get; set; } = null!;
  public virtual DbSet<Usuario> Usuarios { get; set; } = null!;
  public virtual DbSet<Rol> Rol { get; set; } = null!;

  public virtual DbSet<MenuRol> MenuRols { get; set; } = null!;
  public virtual DbSet<Menu> Menus { get; set; } = null!;

  public virtual DbSet<Cita> Citas { get; set; } = null!;

  public virtual DbSet<Servicio> Servicios { get; set; } = null!;


  public virtual DbSet<Odontologo> Odontologos { get; set; } = null!;

  public virtual DbSet<Paciente> Pacientes { get; set; } = null!;
  public virtual DbSet<DetalleCita> DetalleCita { get; set; } = null!;
  public virtual DbSet<NumeroDocumento> NumeroDocumentos { get; set; } = null!;

  // public virtual DbSet<Usuario> Usuarios { get; set; } = null!;
}

