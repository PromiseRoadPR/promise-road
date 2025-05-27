import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { VideoIcon } from "lucide-react";

export default function Videos() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Videos</h1>
          <p className="text-gray-600">Contenido audiovisual cristiano</p>
        </div>
        <Button asChild>
          <Link href="/video/upload">
            Subir Video
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <Card className="overflow-hidden">
          <div className="h-48 bg-blue-100 flex items-center justify-center">
            <VideoIcon className="h-16 w-16 text-blue-500" />
          </div>
          <CardHeader>
            <CardTitle>Adoración: Cómo acercarse a Dios</CardTitle>
            <CardDescription>Publicado el 22 de mayo, 2025 • Adoración</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Una guía práctica sobre cómo profundizar tu experiencia de adoración y acercarte más a Dios.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/video/1">
                Ver video
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-48 bg-blue-100 flex items-center justify-center">
            <VideoIcon className="h-16 w-16 text-blue-500" />
          </div>
          <CardHeader>
            <CardTitle>Testimonio: Mi camino de fe</CardTitle>
            <CardDescription>Publicado el 18 de mayo, 2025 • Testimonio</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Un conmovedor testimonio sobre cómo la fe puede transformar vidas incluso en los momentos más difíciles.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/video/2">
                Ver video
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-48 bg-blue-100 flex items-center justify-center">
            <VideoIcon className="h-16 w-16 text-blue-500" />
          </div>
          <CardHeader>
            <CardTitle>Estudio Bíblico: Romanos 8</CardTitle>
            <CardDescription>Publicado el 10 de mayo, 2025 • Estudio Bíblico</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Un análisis profundo de uno de los capítulos más importantes de la Biblia sobre la vida en el Espíritu.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/video/3">
                Ver video
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-48 bg-blue-100 flex items-center justify-center">
            <VideoIcon className="h-16 w-16 text-blue-500" />
          </div>
          <CardHeader>
            <CardTitle>Alabanza: Grandes son tus obras</CardTitle>
            <CardDescription>Publicado el 5 de mayo, 2025 • Música</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Una sesión de alabanza y adoración que eleva el espíritu y nos conecta con la grandeza de Dios.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/video/4">
                Ver video
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-48 bg-blue-100 flex items-center justify-center">
            <VideoIcon className="h-16 w-16 text-blue-500" />
          </div>
          <CardHeader>
            <CardTitle>Juventud cristiana en el siglo XXI</CardTitle>
            <CardDescription>Publicado el 1 de mayo, 2025 • Juventud</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Desafíos y oportunidades para los jóvenes cristianos en la era digital y cómo mantener su fe.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/video/5">
                Ver video
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-48 bg-blue-100 flex items-center justify-center">
            <VideoIcon className="h-16 w-16 text-blue-500" />
          </div>
          <CardHeader>
            <CardTitle>Predicación: El propósito de Dios</CardTitle>
            <CardDescription>Publicado el 25 de abril, 2025 • Predicación</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Una poderosa predicación sobre cómo descubrir y vivir el propósito que Dios tiene para nuestras vidas.
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/video/6">
                Ver video
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <div className="flex gap-2">
          <Button variant="outline" disabled>Anterior</Button>
          <Button variant="outline">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">Siguiente</Button>
        </div>
      </div>
    </div>
  );
}
