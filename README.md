# AtlCrime

This serves as the official development branch of DSGT. 

Instructions for getting started: 

1. Clone the repository 
2. link the pre-shared "data" folder into the repository (Projects/CrimeMap/data in the google drive), so the new structure is as depicted: 
   ```
    AtlCrime/ 
        data/ 
           file1... 
        Crime.ipynb 
        index.html 
        ```
 3. Startup jupyter notebook 
 4. Get to work! 
 
 
## How it Works 
In the member Google Drive, there is a folder called "Atlanta Crime Data", in `*Projects/CrimeMap/data`. Once that has been added to the repository, the python code reads that in. Then, it histograms the crime data and creates a path around each contour. It then writes these variables to a Javascript file (in the format `var <varname> = <JSON object>` 
In the javascript files, we use Google Map's Javascript Polygon API to create polygons from these paths and plot them on a map. 

Known issues and to-do items can be seen under Issues
