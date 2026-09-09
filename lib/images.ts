// Placeholder photography for local development only — every URL below has
// been visually checked against its label. Replace every entry with real
// Imagine Walls project photography before launch.
function unsplash(id: string, w = 1800) {
  return `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;
}

export const stock = {
  // Living / general residential
  heroLiving: unsplash("photo-1600210492486-724fe5c67fb0"),
  livingLounge: unsplash("photo-1519710164239-da123dc03ef4"),
  livingBeamed: unsplash("photo-1600121848594-d8644e57abab"),
  livingFireplace: unsplash("photo-1600210491892-03d54c0aaf87"),

  // TV units & feature walls
  tvUnitStairs: unsplash("photo-1600566753086-00f18fb6b3ea"),
  tvUnitFeatureWall: unsplash("photo-1600607687939-ce8a6c25118c"),
  tvUnitSofa: unsplash("photo-1493809842364-78817add7ffb"),

  // Dining
  diningLounge: unsplash("photo-1560448204-e02f11c3d0e2"),
  diningCompact: unsplash("photo-1522708323590-d24dbb6b0267"),

  // Kitchens
  kitchenCounter: unsplash("photo-1556909212-d5b604d0c90d"),
  kitchenIsland: unsplash("photo-1484154218962-a197022b5858"),
  kitchenDark: unsplash("photo-1600489000022-c2086d79f9d4"),

  // Bedrooms & wardrobes
  bedroomDresser: unsplash("photo-1556020685-ae41abfc9365"),
  bedroomHeadboard: unsplash("photo-1631049307264-da0ec9d70304"),
  bedroomAccent: unsplash("photo-1540518614846-7eded433c457"),
  bedroomCeilingLight: unsplash("photo-1595526114035-0d45ed16cfbf"),
  wardrobeShelving: unsplash("photo-1595515106969-1ce29566ff1c"),

  // Foyer / entry
  foyerBench: unsplash("photo-1618220252344-8ec99ec624b1"),

  // Ambient / accent lighting
  accentConsole: unsplash("photo-1618220179428-22790b461013"),

  // Commercial
  commercialCorridor: unsplash("photo-1497366216548-37526070297c"),
  commercialMeeting: unsplash("photo-1497366811353-6870744d04b2"),
  commercialLounge: unsplash("photo-1524758631624-e2822e304c36"),

  // Planning / materials
  blueprint: unsplash("photo-1503387762-592deb58ef4e"),
  draftingRuler: unsplash("photo-1503387837-b154d5074bd2"),
  /** Plywood / board stack — Core Boards tab */
  materialCoreBoards: unsplash("photo-1690768162582-342e1e9097a2"),
  /** Finished surface / stone texture — Surfaces tab */
  materialSurfaces: unsplash("photo-1600585154526-990dced4db0d"),
  /** Cabinet fittings in kitchen — Hardware tab */
  materialHardware: unsplash("photo-1556909212-d5b604d0c90d"),
  /** Wall switch & outlet — Electrical tab */
  materialElectrical: unsplash("photo-1759772237947-0c14aef755d5"),

  // Process stages — real photography, one per step
  processConsultation: unsplash("photo-1543269865-cbf427effbad"),
  processApproval: unsplash("photo-1521791136064-7986c2920216"),
  processExecution: unsplash("photo-1621905251189-08b45d6a269e"),
  processQualityCheck: unsplash("photo-1581092160562-40aa08e78837"),
};
