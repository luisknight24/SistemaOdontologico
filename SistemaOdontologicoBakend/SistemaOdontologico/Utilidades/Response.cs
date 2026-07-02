namespace SistemaOdontologico.Utilidades
{
  public class Response<T>
  {
    public bool estado { get; set; }  
    public T valor { get; set; }
    public string mensaje { get; set; }
  }
}
