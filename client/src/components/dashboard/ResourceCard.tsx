import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

interface ResourceLink {
  title: string;
  url: string;
}

interface ResourceCardProps {
  title: string;
  description: string;
  links: ResourceLink[];
  linkUrl: string;
}

const ResourceCard = ({ title, description, links, linkUrl }: ResourceCardProps) => {
  return (
    <Card className="bg-white dark:bg-neutral-800 rounded-lg shadow p-5">
      <CardTitle className="text-md font-semibold text-neutral-800 dark:text-neutral-100 mb-3">
        {title}
      </CardTitle>
      <CardContent className="p-0">
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">{description}</p>
        <ul className="text-sm space-y-2 text-neutral-600 dark:text-neutral-300">
          {links.map((link, index) => (
            <li key={index} className="flex items-center">
              <span className="material-icons text-primary text-sm mr-2">article</span>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                {link.title}
              </a>
            </li>
          ))}
        </ul>
        <Link href={linkUrl}>
          <a className="mt-4 text-sm text-primary hover:text-primary-dark flex items-center">
            <span>Learn More</span>
            <span className="material-icons text-sm ml-1">arrow_forward</span>
          </a>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ResourceCard;
