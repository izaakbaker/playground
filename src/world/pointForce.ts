import { Particle } from "./particle";
import { difference, magnitude, normalized, product, squaredMagnitude } from "../math/vector";
import { IArtist } from "../rendering/artist";
import { Entity } from "./entity";
import uuid from "uuid";
import { ipcRenderer } from "electron";

export class PointForce extends Entity {
    private static NORMAL_RADIUS: number = 15;
    private static FOCUSED_RADIUS: number = 30;
    private static COLOR: number[] = [1, 0, 1];
    private static ATTRACTION_CONSTANT = 13;

    private attraction: number;
    private radius: number;
    private moving: boolean;

    public constructor(initialPosition: number[] = [0, 0], attraction: number = 0) {
        super(`POINT FORCE ${uuid.v4()}`, initialPosition);
        this.attraction = attraction;
        this.radius = PointForce.NORMAL_RADIUS;
        this.moving = false;
    }

    public actOn(particle: Particle): void {
        let vectorToUs = difference(this.position, particle.getPosition());
        const invSqrtDistance: number = 1 / Math.sqrt(magnitude(vectorToUs));
        vectorToUs = normalized(vectorToUs);
        vectorToUs = product(this.attraction * PointForce.ATTRACTION_CONSTANT * invSqrtDistance, vectorToUs);
        particle.accelerate(vectorToUs);
    }

    public onFocus(): void {
        this.radius = PointForce.FOCUSED_RADIUS;
    }

    public onLoseFocus(): void {
        this.radius = PointForce.NORMAL_RADIUS;
    }

    public renderWith(artist: IArtist): void {
        artist.reset();
        artist.setFillColor(PointForce.COLOR[0], PointForce.COLOR[1], PointForce.COLOR[2]);
        artist.ellipse(this.position[0], this.position[1], PointForce.NORMAL_RADIUS);
    }

    public renderFocusedWith(artist: IArtist): void {
        artist.reset();
        artist.setStroke(true);
        artist.setFill(false);
        artist.setStrokeColor(0.5, 0, 0.5);
        artist.ellipse(this.position[0], this.position[1], PointForce.FOCUSED_RADIUS);
    }

    public isHoveredOver(pointer: number[]): boolean {
        const pointerToCenter = difference(this.position, pointer);
        const distance = squaredMagnitude(pointerToCenter);
        return distance < this.radius * this.radius;
    }

    public onDrag(event: MouseEvent): void {
        const pointer = [event.offsetX, event.offsetY];

        let shouldMove: boolean = this.moving;
        if (!shouldMove) {
            const pointerToCenter = difference(this.position, pointer);
            const distance = squaredMagnitude(pointerToCenter);
            shouldMove = distance < PointForce.NORMAL_RADIUS * PointForce.NORMAL_RADIUS;
        }

        if (shouldMove) {
            this.moving = true;
            this.position = pointer;
        }
    }

    public onMouseUp(event: MouseEvent): void {
        this.moving = false;
    }

    public willRelinquishFocus(): boolean {
        return !this.moving;
    }

    public getPriority(): number {
        return 20;
    }
}