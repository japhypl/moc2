import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type SpeakerCardProps = {
  name: string;
  bio?: string;
  photo?: string;
};

function SpeakerCard({ name, bio, photo }: SpeakerCardProps) {
  return (
    <Card className="overflow-hidden text-center">
      {photo && (
        <div className="relative mx-auto mt-5 h-32 w-32 overflow-hidden rounded-full">
          <Image
            src={photo}
            alt={name}
            fill
            className="object-cover"
            sizes="128px"
          />
        </div>
      )}
      <CardContent>
        <h3 className="font-heading text-lg font-semibold text-text-dark">
          {name}
        </h3>
        {bio && <p className="mt-2 text-sm text-text-muted">{bio}</p>}
      </CardContent>
    </Card>
  );
}

export { SpeakerCard };
export type { SpeakerCardProps };
