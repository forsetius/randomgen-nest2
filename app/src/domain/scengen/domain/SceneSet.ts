import { EdgeId, SceneId } from '@domain/scengen/types/aliases';
import { Scene } from '@domain/scengen/domain/Scene';
import { AutoMapOfMaps } from '@shared/util/collections/AutoMapOfMaps';
import { SceneEdge } from '@domain/scengen/domain/SceneEdge';
import { EdgeType } from '@domain/scengen/types/EdgeType';
import { Lang } from '@shared/types/Lang';

export class SceneSet {
  public readonly scenes = new Map<SceneId, Scene>();
  public readonly edgesFromScenes = new AutoMapOfMaps<
    SceneId,
    EdgeId,
    SceneEdge
  >();
  public readonly edgesToScenes = new AutoMapOfMaps<
    SceneId,
    EdgeId,
    SceneEdge
  >();
  public start: Scene | null = null;
  public finish: Scene | null = null;

  /**
   * Adds a scene to the set
   *
   * Sets the added scene as the start scene if it is the first scene added.
   */
  public addScene(scene: Scene): Scene {
    this.scenes.set(scene.id, scene);
    this.start ??= scene;

    return scene;
  }

  public addEdge(
    from: Scene,
    to: Scene,
    type: EdgeType = EdgeType.NORMAL,
    description?: string,
  ) {
    const edge = new SceneEdge(from, to, type, description);
    this.edgesFromScenes.add(from.id, edge.id, edge);
    this.edgesToScenes.add(to.id, edge.id, edge);
  }

  public addSet(from: Scene, set: SceneSet): Scene {
    if (!this.start || !this.finish) {
      throw new Error('Cannot merge a set into a scenario');
    }

    for (const scene of set.scenes.values()) {
      this.addScene(scene);
    }
    for (const [sceneId, edgeMap] of set.edgesFromScenes.entries()) {
      this.edgesFromScenes.set(sceneId, edgeMap);
    }
    for (const [sceneId, edgeMap] of set.edgesToScenes.entries()) {
      this.edgesFromScenes.set(sceneId, edgeMap);
    }

    this.addEdge(from, set.start!);

    return set.finish!;
  }

  public toJson(lang: Lang) {
    return this.serializeSceneGraph().map((scene) => scene.serialize(lang));
  }

  private serializeSceneGraph(): Scene[] {
    if (!this.start || !this.finish) {
      throw new Error('Scenario must have a start an an end scene');
    }

    const visited = new Set<Scene>();
    const result: Scene[] = [];
    const queue: Scene[] = [this.start];

    while (queue.length > 0) {
      const currentScene = queue.shift()!;
      if (visited.has(currentScene)) continue;

      visited.add(currentScene);
      result.push(currentScene);

      const outEdges = this.edgesFromScenes.getCollection(currentScene.id);
      const sortedEdges = [...outEdges.values()].sort(
        this.edgeComparator.bind(this),
      );

      for (const edge of sortedEdges) {
        if (!visited.has(edge.to)) queue.push(edge.to);
      }
    }

    const unreachableScenes = [...this.scenes.values()]
      .filter((scene) => !visited.has(scene))
      .sort((a, b) => a.id.localeCompare(b.name));

    return result.concat(unreachableScenes);
  }

  private edgeComparator(a: SceneEdge, b: SceneEdge): number {
    const typeOrder: Record<string, number> = {
      [EdgeType.NORMAL]: 0,
      [EdgeType.SUCCESS]: 1,
      [EdgeType.FAILURE]: 2,
      [EdgeType.OPTIONAL]: 3,
      [EdgeType.RETURN]: 4,
    };

    const typeDiff = typeOrder[a.type]! - typeOrder[b.type]!;
    if (typeDiff !== 0) return typeDiff;

    return a.id.localeCompare(b.id);
  }
}
