import { useState, useEffect } from 'react';
import { ProjectAPI, APIProject } from '../types/index';

const API_URL = 'https://domumarquitectura.com/assets/API.php';

export const useProjects = () => {
    const [projects, setProjects] = useState<ProjectAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const transformAPIProject = (apiProject: APIProject): ProjectAPI => {
        let gallery: string[] = [];
        try {
            gallery = JSON.parse(apiProject["COL 10"] || '[]');
        } catch (e) {
            console.warn('Error parsing gallery JSON:', e);
            gallery = [];
        }

        return {
            id: apiProject["COL 1"],
            title: apiProject["COL 2"],
            description: apiProject["COL 3"],
            content: apiProject["COL 4"],
            category: apiProject["COL 5"],
            year: apiProject["COL 6"],
            location: apiProject["COL 7"],
            client: apiProject["COL 8"],
            image_url: apiProject["COL 9"],
            gallery,
            created_at: apiProject["COL 11"],
            updated_at: apiProject["COL 12"],
            slug: apiProject["COL 13"],
            meters: apiProject["COL 14"],
        };
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.error) {
                    throw new Error(data.error);
                }

                const projectData = data.slice(1);
                const transformedProjects = projectData.map(transformAPIProject);

                setProjects(transformedProjects);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return { projects, loading, error, refetch: () => window.location.reload() };
}