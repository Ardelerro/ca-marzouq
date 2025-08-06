import projects from '$lib/data/projects.json';
import bio from '$lib/data/writing.json';

export function load() {
  return {
    projects,
    bio
  };
}